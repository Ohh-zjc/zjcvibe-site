import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import seedRecords from '../data/conservation.json'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { validateRecord } from '../lib/conservation'

const CACHE_KEY = 'dongtinghu-conservation-v1'
const clone = value => JSON.parse(JSON.stringify(value))

export const useConservationStore = defineStore('conservation', () => {
  const records = ref(clone(seedRecords))
  const mode = ref(supabaseConfigured ? 'connecting' : 'local')
  const error = ref('')
  const loading = ref(false)
  const dirty = ref(false)
  let loadVersion = 0
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (cached?.version === 1 && Array.isArray(cached.records)) {
      cached.records.forEach(validateRecord)
      const merged = new Map(records.value.map(record => [record.id, record]))
      cached.records.forEach(record => merged.set(record.id, record))
      records.value = [...merged.values()]
      dirty.value = !!cached.dirty
    }
  } catch { error.value = '本机记录缓存未能读取，当前展示随项目提供的原始档案。' }

  const published = computed(() => records.value.filter(record => record.status === 'published').sort((a, b) => b.date.localeCompare(a.date)))
  const years = computed(() => [...new Set(published.value.map(record => record.date.slice(0, 4)))].sort().reverse())

  function persist(next, nextDirty = true) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version: 1, records: next, dirty: nextDirty })) }
    catch { throw new Error('本机存储空间不足，请先导出备份，或减少上传图片的数量。') }
    records.value = next
    dirty.value = nextDirty
  }

  async function load(includeDrafts = false) {
    if (!supabaseConfigured) return
    const currentVersion = ++loadVersion
    loading.value = true
    try {
      let query = supabase.from('conservation_records').select('id,payload,status')
      if (!includeDrafts) query = query.eq('status', 'published')
      const result = await query
      if (currentVersion !== loadVersion) return
      if (result.error) throw result.error
      const rows = result.data.map(row => validateRecord({ ...row.payload, id: row.id, status: row.status }))
      // A working cloud table is authoritative, including a deliberately empty table.
      // Unsynced local work remains available until explicitly uploaded by its editor.
      if (!dirty.value) persist(rows, false)
      mode.value = 'cloud'
      error.value = ''
    } catch { if (currentVersion === loadVersion) { mode.value = 'offline'; error.value = '云端档案暂不可用，已保留本机与项目档案。' } }
    if (currentVersion === loadVersion) loading.value = false
  }

  async function save(input) {
    const record = validateRecord(clone(input))
    record.id ||= crypto.randomUUID()
    record.updatedAt = new Date().toISOString()
    const next = records.value.filter(item => item.id !== record.id).concat(record)
    if (supabaseConfigured) {
      const { error: cloudError } = await supabase.from('conservation_records').upsert({ id: record.id, payload: record, status: record.status, record_date: record.date })
      if (cloudError) throw new Error('云端保存失败，请保留表单内容并导出备份。')
      persist(next, dirty.value)
      mode.value = 'cloud'
    } else persist(next)
    return record
  }

  async function archive(id) {
    const record = records.value.find(item => item.id === id)
    if (record) await save({ ...record, status: 'archived' })
  }

  function exportBackup() {
    return JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), records: records.value }, null, 2)
  }

  function parseBackup(text) {
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed) && parsed.schemaVersion !== 1) throw new Error('备份格式版本不支持')
    const incoming = Array.isArray(parsed) ? parsed : parsed.records
    if (!Array.isArray(incoming) || incoming.length > 2000) throw new Error('备份须包含不超过2000条记录')
    const ids = new Set()
    incoming.forEach(record => {
      validateRecord(record)
      if (!record.id || ids.has(record.id)) throw new Error('备份存在缺失或重复的记录编号')
      ids.add(record.id)
    })
    return incoming
  }

  async function importBackup(incoming) {
    const validated = parseBackup(JSON.stringify(incoming))
    const merged = new Map(records.value.map(item => [item.id, item]))
    validated.forEach(item => merged.set(item.id, item))
    if (supabaseConfigured && validated.length) {
      const { error: cloudError } = await supabase.from('conservation_records').upsert(validated.map(item => ({ id: item.id, payload: item, status: item.status, record_date: item.date })))
      if (cloudError) throw new Error('云端导入失败，现有数据未替换。')
    }
    persist([...merged.values()], !supabaseConfigured || dirty.value)
  }

  async function syncLocal() {
    if (!supabaseConfigured) throw new Error('请先按照交接说明配置云端数据库')
    const result = await supabase.from('conservation_records').upsert(records.value.map(record => ({ id: record.id, payload: record, status: record.status, record_date: record.date })))
    if (result.error) throw new Error('同步失败，请检查管理员登录与数据库表配置')
    persist(records.value, false)
    mode.value = 'cloud'
  }

  load()
  return { records, published, years, loading, mode, error, dirty, load, save, archive, exportBackup, parseBackup, importBackup, syncLocal }
})

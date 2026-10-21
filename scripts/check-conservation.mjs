import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { createServer } from 'vite'
import { createPinia, setActivePinia } from 'pinia'
import { validateRecord, validRecordDate, recordsToCsv, csvCell } from '../src/lib/conservation.js'

const seeds = JSON.parse(await readFile(new URL('../src/data/conservation.json', import.meta.url)))
const ids = new Set()
for (const record of seeds) {
  validateRecord(record)
  assert(!ids.has(record.id)); ids.add(record.id)
  for (const photo of record.photos) if (photo.src.startsWith('/img/')) await access(new URL(`../public${photo.src}`, import.meta.url))
}
assert(validRecordDate('2024-02-29','day'))
assert(!validRecordDate('2026-02-29','day'))
assert(!validRecordDate('2026-13','month'))
assert(validRecordDate('2026-07','month'))
assert(validRecordDate('2018','year'))
assert.throws(() => validateRecord({...seeds[0],dateEnd:'2017-01-01'}))
assert.throws(() => validateRecord({...seeds[0],sourceUrl:'javascript:alert(1)'}))
assert.throws(() => validateRecord({...seeds[0],kind:'report',sourceUrl:''}))
assert.throws(() => validateRecord({...seeds[0],metrics:{participants:-1}}))
assert.throws(() => validateRecord({...seeds[0],body:[]}))
assert.equal(csvCell('=1+1'),'"\'=1+1"')
assert.equal(csvCell('a"b'),'"a""b"')
assert(recordsToCsv(seeds).startsWith('\uFEFF'))
assert(recordsToCsv(seeds).includes('2018-03-02'))
assert.equal(seeds.find(record => record.id === 'field-2026-cleanup').datePrecision,'month')
assert(!seeds.find(record => record.id === 'association-report-2022').photos.length)

const values = new Map()
let quotaBlocked = false
globalThis.localStorage = { getItem:key => values.get(key) ?? null, setItem:(key,value) => { if(quotaBlocked) throw new Error('quota'); values.set(key,value) }, removeItem:key => values.delete(key) }
const server = await createServer({server:{middlewareMode:true},appType:'custom'})
try {
  const { useConservationStore } = await server.ssrLoadModule('/src/stores/conservation.js')
  setActivePinia(createPinia())
  let store = useConservationStore()
  const created = await store.save({...seeds[0],id:undefined,title:'测试记录',status:'draft'})
  assert(created.id)
  assert.equal(store.published.length,seeds.length)
  await store.save({...created,status:'published'})
  assert.equal(store.published.length,seeds.length+1)
  setActivePinia(createPinia()); store = useConservationStore()
  assert(store.records.some(record => record.id === created.id && record.status === 'published'))
  await store.archive(created.id)
  assert.equal(store.published.length,seeds.length)
  assert.equal(store.records.find(record => record.id === created.id).status,'archived')
  const backup = store.exportBackup()
  const parsed = store.parseBackup(backup)
  assert.equal(parsed.length,seeds.length+1)
  assert.throws(() => store.parseBackup(JSON.stringify({schemaVersion:2,records:seeds})))
  assert.throws(() => store.parseBackup(JSON.stringify([seeds[0],seeds[0]])))
  await store.importBackup([{...created,title:'已导入',status:'draft'}])
  assert.equal(store.records.find(record => record.id === created.id).title,'已导入')
  const oldLength = store.records.length
  quotaBlocked = true
  await assert.rejects(store.save({...created,id:undefined}),/空间不足/)
  assert.equal(store.records.length,oldLength)
  quotaBlocked = false
  const { useAuthStore } = await server.ssrLoadModule('/src/stores/auth.js')
  const auth = useAuthStore(); await auth.ready
  assert.equal((await auth.login('','invalid-test-password')).success,false)
  assert.equal(auth.isLoggedIn,false)
  console.log(`PASS: ${seeds.length} records and photo paths; date, provenance, CSV; local save/reload/archive/import/backup/quota; invalid login.`)
} finally { await server.close() }

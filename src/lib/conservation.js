export const CATEGORIES = [
  { id: 'patrol', name: '巡护保护', icon: 'patrol', description: '把日常巡护与现场发现留成可回看的记录。' },
  { id: 'monitor', name: '水质与岸线', icon: 'water', description: '为水样、湖岸影像与环境观察保留出处。' },
  { id: 'cleanup', name: '净滩行动', icon: 'leaf', description: '记录岸边的每一次行动与公众参与。' },
  { id: 'education', name: '自然教育', icon: 'book', description: '让江豚的故事走进课堂、社区与更多人的生活。' },
]
export const KIND_LABELS = { archive: '协会原始档案', field: '实践现场记录', report: '公开报道整理' }
export const METRICS = [
  { key: 'distanceKm', label: '巡护里程', unit: 'km' },
  { key: 'durationHours', label: '巡护时长', unit: '小时' },
  { key: 'participants', label: '参与人数', unit: '人' },
  { key: 'cleanupKg', label: '清理重量', unit: 'kg' },
  { key: 'tds', label: '水样TDS', unit: 'mg/L' },
]
export function publicAsset(path) {
  if (!path) return ''
  if (/^(https?:\/\/|data:image\/(?:png|jpe?g|webp);base64,)/i.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
export function categoryName(id) { return CATEGORIES.find(item => item.id === id)?.name || '保护记录' }
export function formatRecordDate(record) {
  const [year, month, day] = String(record.date || '').split('-')
  if (!month) return `${year}年`
  if (!day) return `${year}年${Number(month)}月`
  return `${year}.${month}.${day}`
}
export function safeHttpUrl(value) {
  if (!value) return true
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}
export function validRecordDate(value, precision) {
  const expression = { year: /^\d{4}$/, month: /^\d{4}-\d{2}$/, day: /^\d{4}-\d{2}-\d{2}$/ }[precision]
  if (!expression?.test(value)) return false
  const full = precision === 'year' ? `${value}-01-01` : precision === 'month' ? `${value}-01` : value
  const parsed = new Date(`${full}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === full
}
export function validateRecord(record) {
  if (record.id != null && (typeof record.id !== 'string' || !/^[a-zA-Z0-9_-]{1,120}$/.test(record.id))) throw new Error('记录编号格式无效')
  if (!record.title?.trim()) throw new Error('请填写记录标题')
  if (!validRecordDate(record.date, record.datePrecision || 'day')) throw new Error('请填写有效的记录时间')
  if (record.dateEnd && (!validRecordDate(record.dateEnd, record.datePrecision || 'day') || record.dateEnd < record.date)) throw new Error('结束时间须有效且不早于开始时间')
  if (!CATEGORIES.some(category => category.id === record.category)) throw new Error('请选择记录分类')
  if (!Object.hasOwn(KIND_LABELS, record.kind)) throw new Error('请选择资料来源类型')
  if (!['draft', 'published', 'archived'].includes(record.status)) throw new Error('记录状态无效')
  if (!record.summary?.trim()) throw new Error('请填写记录摘要')
  if (!record.sourceName?.trim()) throw new Error('请注明资料来源')
  if (record.body != null && typeof record.body !== 'string') throw new Error('详细记录须为文字')
  if (!safeHttpUrl(record.sourceUrl)) throw new Error('来源链接须以http或https开头')
  if (record.kind === 'report' && !record.sourceUrl) throw new Error('公开报道请填写原文链接')
  if (!Array.isArray(record.photos) || record.photos.length > 12) throw new Error('每条记录最多保存12张图片')
  for (const photo of record.photos) {
    if (!photo.src || !/^(\/img\/|https?:\/\/|data:image\/(?:png|jpe?g|webp);base64,)/i.test(photo.src)) throw new Error('图片地址无效')
  }
  for (const metric of METRICS) {
    const value = record.metrics?.[metric.key]
    if (value != null && value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0)) throw new Error(`${metric.label}须为非负数`)
  }
  return record
}
export function csvCell(value) {
  let text = String(value ?? '')
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}
export function recordsToCsv(records) {
  const rows = [['标题', '时间', '时间精度', '分类', '地点', '记录单位', '资料类型', '摘要', '来源', '来源链接', ...METRICS.map(item => `${item.label}(${item.unit})`)]]
  for (const item of records) rows.push([item.title, item.date, item.datePrecision, categoryName(item.category), item.location, item.organizer, KIND_LABELS[item.kind], item.summary, item.sourceName, item.sourceUrl, ...METRICS.map(metric => item.metrics?.[metric.key] ?? '')])
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n')
}
export function downloadText(text, name, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }))
  const link = document.createElement('a')
  link.href = url; link.download = name; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

<template>
  <div class="record-manager">
    <header class="manager-heading"><div><h2>护江记录管理</h2><p>补充现场记录、整理历史资料，让档案持续更新。</p></div><el-button type="primary" @click="openEditor()">新增记录</el-button></header>
    <el-alert v-if="!supabaseConfigured" title="当前保存于本机浏览器" type="info" :closable="false" show-icon><template #default>编辑后请导出备份。让其他设备也能看到更新，需导出“发布数据JSON”交给维护人员重新发布，或按交接说明配置云端。</template></el-alert>
    <el-alert v-else :title="store.mode === 'cloud' ? '已连接云端档案' : '云端连接待检查'" :type="store.mode === 'cloud' ? 'success' : 'warning'" :closable="false" show-icon/>
    <el-alert v-if="store.error" :title="store.error" type="warning" :closable="false" show-icon/>
    <div class="manager-actions"><el-button @click="exportBackup">导出完整备份</el-button><el-button @click="exportPublishData">发布数据JSON</el-button><el-button @click="importInput.click()">导入备份</el-button><el-button @click="downloadText(recordsToCsv(store.records), '护江记录总表.csv', 'text/csv')">导出总表CSV</el-button><el-button v-if="supabaseConfigured && store.dirty" :loading="busy" @click="syncLocal">同步本机档案到云端</el-button><input ref="importInput" hidden type="file" accept=".json,application/json" @change="prepareImport"/></div>
    <div class="manager-filters"><label><span class="sr-only">搜索管理记录</span><input v-model="search" placeholder="搜索标题、地点、来源"/></label><label><span class="sr-only">记录状态</span><select v-model="status"><option value="">全部状态</option><option value="published">已发布</option><option value="draft">草稿</option><option value="archived">已归档</option></select></label><span>共 {{ filtered.length }} 条</span></div>
    <el-table :data="paged" v-loading="store.loading" stripe style="width:100%"><el-table-column label="记录" min-width="250"><template #default="{ row }"><strong>{{ row.title }}</strong><small class="manager-row-note">{{ categoryName(row.category) }} · {{ row.sourceName }}</small></template></el-table-column><el-table-column label="时间" width="130"><template #default="{ row }">{{ formatRecordDate(row) }}</template></el-table-column><el-table-column label="状态" width="95"><template #default="{ row }"><el-tag :type="row.status === 'published' ? 'success' : row.status === 'draft' ? 'warning' : 'info'">{{ statuses[row.status] }}</el-tag></template></el-table-column><el-table-column label="操作" width="190" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openEditor(row)">编辑</el-button><router-link v-if="row.status === 'published'" :to="`/records/${row.id}`" class="manager-preview">查看</router-link><el-button v-if="row.status !== 'archived'" link type="danger" @click="archiveRecord(row)">归档</el-button></template></el-table-column></el-table>
    <el-pagination v-model:current-page="page" :page-size="12" :total="filtered.length" layout="prev, pager, next" class="manager-pagination"/>
    <el-dialog v-model="editorOpen" :title="form.id ? '编辑护江记录' : '新增护江记录'" width="900px" class="record-editor-dialog" :close-on-click-modal="false" @close="formError = ''">
      <form id="conservation-editor" class="record-editor" @submit.prevent="saveRecord">
        <p class="editor-help">带 * 为必填。没有核实的数字请留空；仅知道年份或月份时，请选择相应的时间精度。</p>
        <label class="editor-full">记录标题 *<input v-model="form.title" maxlength="100" required/></label>
        <label>保护方向 *<select v-model="form.category"><option v-for="item in CATEGORIES" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
        <label>资料类型 *<select v-model="form.kind"><option v-for="(name,key) in KIND_LABELS" :key="key" :value="key">{{ name }}</option></select></label>
        <label>时间精度 *<select v-model="form.datePrecision" @change="adjustDate"><option value="day">具体日期</option><option value="month">仅确认到月份</option><option value="year">仅确认到年份</option></select></label>
        <label>记录时间 *<input v-model="form.date" :type="form.datePrecision === 'year' ? 'text' : form.datePrecision === 'month' ? 'month' : 'date'" :placeholder="form.datePrecision === 'year' ? '如：2026' : ''" required/></label>
        <label class="editor-full">结束时间（多日活动选填）<input v-model="form.dateEnd" :type="form.datePrecision === 'year' ? 'text' : form.datePrecision === 'month' ? 'month' : 'date'"/></label>
        <label>地点<input v-model="form.location" maxlength="150"/></label><label>记录 / 组织单位<input v-model="form.organizer" maxlength="150"/></label>
        <label class="editor-full">摘要 *<textarea v-model="form.summary" rows="3" maxlength="500" required/></label>
        <label class="editor-full">详细记录<textarea v-model="bodyText" rows="7" placeholder="填写巡护发现、活动过程、后续跟进等；段落之间空一行。"/></label>
        <label>资料来源 *<input v-model="form.sourceName" required placeholder="如：协会巡护登记表、现场记录或报道媒体"/></label><label>原文链接<input v-model="form.sourceUrl" type="url" :required="form.kind === 'report'" placeholder="https://…"/></label>
        <label class="editor-full">来源及核实说明<textarea v-model="form.sourceNote" rows="2" placeholder="照片拍摄时间、整理依据、近似数字的说明等。"/></label>
        <fieldset class="editor-full editor-metrics"><legend>现场数据（选填）</legend><div><label v-for="metric in METRICS" :key="metric.key">{{ metric.label }}（{{ metric.unit }}）<input v-model="form.metrics[metric.key]" type="number" min="0" step="any" placeholder="未统计请留空"/></label></div></fieldset>
        <fieldset class="editor-full editor-photos"><legend>现场图片（最多12张，首张作为封面）</legend><div class="photo-actions"><el-button :loading="uploading" @click="photoInput.click()">上传照片</el-button><input ref="photoInput" hidden type="file" accept="image/jpeg,image/png,image/webp" multiple @change="uploadPhotos"/><input v-model="photoUrl" aria-label="图片网址" placeholder="也可粘贴图片网址或 /img/… 路径"/><el-button @click="addPhotoUrl">添加图片</el-button></div><p class="editor-help">照片按比例压缩保存；填写说明，区分历史影像和本次现场照片。</p><div v-for="(photo,index) in form.photos" :key="index" class="editor-photo-row"><img :src="publicAsset(photo.src)" :alt="photo.caption || '待说明的现场图片'"/><label><span class="sr-only">第{{ index + 1 }}张图片说明</span><input v-model="photo.caption" placeholder="图片说明 / 时间 / 拍摄者"/></label><div><el-button link :disabled="index === 0" @click="movePhoto(index,-1)">上移</el-button><el-button link :disabled="index === form.photos.length - 1" @click="movePhoto(index,1)">下移</el-button><el-button link type="danger" @click="form.photos.splice(index,1)">移除</el-button></div></div></fieldset>
        <label>发布状态<select v-model="form.status"><option value="draft">草稿（前台不可见）</option><option value="published">已发布（前台可见）</option><option value="archived">已归档（保留备份）</option></select></label><label class="editor-featured"><input type="checkbox" v-model="form.featured"/>推荐到首页</label>
        <el-alert v-if="formError" :title="formError" type="error" :closable="false" class="editor-full"/>
      </form>
      <template #footer><el-button @click="editorOpen = false">取消</el-button><el-button type="primary" native-type="submit" form="conservation-editor" :loading="busy" :disabled="uploading">保存记录</el-button></template>
    </el-dialog>
    <el-dialog v-model="importOpen" title="核对导入内容" width="470px" :close-on-click-modal="false"><p>备份中有 {{ incoming.length }} 条记录。同编号记录将更新，新编号记录将添加；其他现有记录保留。</p><p class="editor-help">请先导出当前备份，再确认导入。</p><template #footer><el-button @click="importOpen = false">取消</el-button><el-button type="primary" :loading="busy" @click="confirmImport">确认导入</el-button></template></el-dialog>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useConservationStore } from '../../stores/conservation'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import { CATEGORIES, KIND_LABELS, METRICS, categoryName, formatRecordDate, publicAsset, safeHttpUrl, recordsToCsv, downloadText } from '../../lib/conservation'
const store = useConservationStore()
const statuses = { published:'已发布', draft:'草稿', archived:'已归档' }
const search = ref(''), status = ref(''), page = ref(1), busy = ref(false), uploading = ref(false)
const editorOpen = ref(false), form = ref({}), bodyText = ref(''), formError = ref(''), photoUrl = ref('')
const photoInput = ref(null), importInput = ref(null), importOpen = ref(false), incoming = ref([])
const filtered = computed(() => store.records.filter(record => (!status.value || record.status === status.value) && [record.title,record.location,record.sourceName].join(' ').toLowerCase().includes(search.value.trim().toLowerCase())).sort((a,b) => b.date.localeCompare(a.date)))
const paged = computed(() => filtered.value.slice((page.value-1)*12, page.value*12))
watch([search,status], () => page.value = 1)
onMounted(() => store.load(true))
function openEditor(record) {
  const empty = { title:'',category:'patrol',kind:'field',date:'',datePrecision:'day',location:'',organizer:'岳阳市江豚保护协会',summary:'',body:'',sourceName:'',sourceUrl:'',sourceNote:'',metrics:{},photos:[],status:'draft',featured:false,tags:[] }
  form.value = JSON.parse(JSON.stringify(record || empty))
  form.value.metrics ||= {}; form.value.photos ||= []
  bodyText.value = form.value.body || ''
  formError.value = ''; photoUrl.value = ''; editorOpen.value = true
}
function adjustDate() {
  const length = { year:4, month:7, day:10 }[form.value.datePrecision]
  form.value.date = form.value.date.length >= length ? form.value.date.slice(0,length) : ''
  delete form.value.dateEnd
}
async function saveRecord() {
  busy.value = true; formError.value = ''
  try {
    const metrics = Object.fromEntries(Object.entries(form.value.metrics).filter(([,value]) => value !== '' && value != null).map(([key,value]) => [key,Number(value)]))
    await store.save({ ...form.value, metrics, body:bodyText.value.trim() })
    editorOpen.value = false; ElMessage.success(supabaseConfigured ? '记录已保存到云端' : '记录已保存在本机，请记得导出备份')
  } catch (error) { formError.value = error.message }
  finally { busy.value = false }
}
async function archiveRecord(record) {
  try { await ElMessageBox.confirm(`“${record.title}”将从前台隐藏，仍保留在后台，可通过编辑重新发布。`, '归档这条记录', { confirmButtonText:'确认归档',cancelButtonText:'取消',type:'warning' }); await store.archive(record.id); ElMessage.success('已归档，可在全部状态中找回') }
  catch (error) { if (error?.message) ElMessage.error(error.message) }
}
function exportBackup() { downloadText(store.exportBackup(), '护江档案-完整备份.json') }
function exportPublishData() { downloadText(JSON.stringify(store.records,null,2), 'conservation.json'); ElMessage.success('将此文件交给维护人员替换 src/data/conservation.json 后重新构建发布') }
async function prepareImport(event) {
  const file = event.target.files?.[0]; event.target.value = ''
  if (!file) return
  try { if (file.size > 25*1024*1024) throw new Error('备份文件不能超过25MB'); incoming.value = store.parseBackup(await file.text()); importOpen.value = true }
  catch (error) { ElMessage.error(`导入文件未通过校验：${error.message}`) }
}
async function confirmImport() { busy.value = true; try { await store.importBackup(incoming.value); importOpen.value = false; ElMessage.success('导入完成') } catch (error) { ElMessage.error(error.message) } finally { busy.value = false } }
async function syncLocal() { busy.value = true; try { await ElMessageBox.confirm('本机同编号档案将覆盖云端版本，请先导出备份。', '同步本机档案', {confirmButtonText:'确认同步',cancelButtonText:'取消'}); await store.syncLocal(); ElMessage.success('同步完成') } catch (error) { if (error?.message) ElMessage.error(error.message) } finally { busy.value = false } }
function addPhotoUrl() {
  const src = photoUrl.value.trim()
  if ((!src.startsWith('/img/') && !/^https?:\/\//i.test(src)) || !safeHttpUrl(src.startsWith('/img/') ? '' : src)) return ElMessage.error('请填写有效的图片网址或 /img/… 路径')
  if (form.value.photos.length >= 12) return ElMessage.error('最多12张图片')
  form.value.photos.push({src,caption:''}); photoUrl.value = ''
}
function movePhoto(index,step) { const moved = form.value.photos.splice(index,1)[0]; form.value.photos.splice(index+step,0,moved) }
async function compressPhoto(file) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('仅支持JPEG、PNG或WebP照片')
  if (file.size > 30*1024*1024) throw new Error('单张照片不能超过30MB')
  const bitmap = await createImageBitmap(file)
  const ratio = Math.min(1,1600/Math.max(bitmap.width,bitmap.height))
  const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width*ratio); canvas.height = Math.round(bitmap.height*ratio)
  const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0,0,canvas.width,canvas.height); context.drawImage(bitmap,0,0,canvas.width,canvas.height); bitmap.close()
  return new Promise((resolve,reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('照片压缩失败')), 'image/jpeg',0.8))
}
async function uploadPhotos(event) {
  const files = [...event.target.files]; event.target.value = ''
  if (form.value.photos.length + files.length > 12) return ElMessage.error('每条记录最多12张图片')
  uploading.value = true
  try { for (const file of files) {
    const blob = await compressPhoto(file)
    let src
    if (supabaseConfigured) {
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.jpg`
      const result = await supabase.storage.from('conservation-images').upload(path,blob,{contentType:'image/jpeg',upsert:false})
      if (result.error) throw new Error('图片上传失败，请检查 conservation-images 存储桶与登录权限')
      src = supabase.storage.from('conservation-images').getPublicUrl(path).data.publicUrl
    } else src = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('照片读取失败')); reader.readAsDataURL(blob) })
    form.value.photos.push({src,caption:file.name.replace(/\.[^.]+$/,'')})
  } } catch (error) { ElMessage.error(error.message) } finally { uploading.value = false }
}
</script>
<style scoped>
.manager-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}.manager-heading h2{font-size:24px;color:#284d3e}.manager-heading p{font-size:13px;color:#718275;margin-top:8px}.record-manager>.el-alert{margin-bottom:14px}.manager-actions{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}.manager-actions .el-button{margin:0}.manager-filters{display:flex;gap:12px;align-items:center;margin-bottom:18px}.manager-filters input,.manager-filters select{padding:9px 12px;border:1px solid #d9e1d5;border-radius:4px;background:white;font:inherit;font-size:13px}.manager-filters span{color:#73816d;font-size:12px}.manager-row-note{display:block;font-size:11px;color:#7c8b75;margin-top:5px}.manager-preview{font-size:12px;color:var(--primary);margin:0 11px}.manager-pagination{justify-content:center;margin:25px 0}.record-editor{display:grid;grid-template-columns:1fr 1fr;gap:17px 22px}.record-editor>label,.editor-metrics label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#4f654a}.editor-full{grid-column:1/-1}.record-editor input:not([type=checkbox]),.record-editor select,.record-editor textarea{width:100%;border:1px solid #d5dfcf;border-radius:4px;padding:9px 11px;font:inherit;color:#354c31;background:white;min-width:0}.record-editor textarea{resize:vertical;line-height:1.8}.editor-help{font-size:11px;color:#7c8974;line-height:1.8;grid-column:1/-1}.record-editor fieldset{border:1px solid #dce5d6;padding:16px;border-radius:4px;min-width:0}.record-editor legend{padding:0 5px;color:#5e7655;font-size:12px}.editor-metrics>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.editor-metrics label{font-size:11px}.photo-actions{display:flex;gap:8px;align-items:center}.photo-actions .el-button{margin:0}.photo-actions input{flex:1}.editor-photo-row{display:flex;align-items:center;gap:13px;margin-top:12px}.editor-photo-row img{width:90px;height:65px;object-fit:contain;background:#edf1e8}.editor-photo-row label{flex:1}.editor-featured{flex-direction:row!important;align-items:center;padding-top:20px}.editor-featured input{width:auto}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:750px){.record-editor{grid-template-columns:1fr}.editor-full{grid-column:1}.editor-metrics>div{grid-template-columns:1fr 1fr}.editor-photo-row{flex-wrap:wrap}.editor-photo-row>div{width:100%}.photo-actions{flex-wrap:wrap}.photo-actions input{flex-basis:100%;order:2}.manager-filters{flex-wrap:wrap}.manager-heading h2{font-size:20px}}
</style>

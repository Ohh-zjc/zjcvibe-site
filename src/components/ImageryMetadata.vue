<template>
  <dl class="imagery-metadata" aria-label="影像元数据">
    <div>
      <dt>影像年份</dt>
      <dd>{{ entry.year }}</dd>
    </div>
    <div>
      <dt>拍摄日期</dt>
      <dd>{{ entry.date || entry.dateRange || '待补充' }}</dd>
    </div>
    <div>
      <dt>数据来源</dt>
      <dd>{{ entry.source || '影像待补充' }}</dd>
    </div>
    <div>
      <dt>产品编号</dt>
      <dd>{{ entry.productId || '待补充' }}</dd>
    </div>
    <div>
      <dt>云量</dt>
      <dd>{{ entry.cloudCover === null || entry.cloudCover === undefined ? '待补充' : `${entry.cloudCover}%` }}</dd>
    </div>
    <div>
      <dt>处理方式</dt>
      <dd>{{ entry.processing || '真彩色影像' }}</dd>
    </div>
  </dl>
  <p class="imagery-attribution">{{ entry.attribution || '影像待补充，尚未形成可核验的来源信息。' }}</p>
  <a
    v-if="entry.sourcePage"
    class="source-link"
    :href="entry.sourcePage"
    target="_blank"
    rel="noopener noreferrer"
  >
    查看数据来源
  </a>
</template>

<script setup>
defineProps({
  entry: { type: Object, required: true },
})
</script>

<style scoped>
.imagery-metadata {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

.imagery-metadata div {
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid var(--border);
  background: #f8fbfc;
}

dt {
  color: var(--text-muted);
  font-size: 12px;
}

dd {
  margin: 2px 0 0;
  overflow-wrap: anywhere;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
}

.imagery-attribution {
  margin: 12px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.source-link {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 720px) {
  .imagery-metadata {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

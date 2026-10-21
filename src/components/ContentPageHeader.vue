<template>
  <header class="content-page-heading" :class="{ 'with-photo': photo }">
    <div><h1>{{ title }}</h1><p>{{ description }}</p><slot /></div>
    <figure v-if="photo"><img :src="publicAsset(photo)" :alt="caption" :width="width" :height="height" loading="lazy" /><figcaption>{{ caption }}</figcaption></figure>
  </header>
</template>
<script setup>
import { publicAsset } from '../lib/conservation'
defineProps({ title: { type: String, required: true }, description: { type: String, required: true }, photo: { type: String, default: '' }, caption: { type: String, default: '' }, width: { type: Number, default: 1800 }, height: { type: Number, default: 1013 } })
</script>

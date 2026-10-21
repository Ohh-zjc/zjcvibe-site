<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'river'"><path d="M3 7c3-3 5 3 8 0s5 3 10 0M3 12c3-3 5 3 8 0s5 3 10 0M3 17c3-3 5 3 8 0s5 3 10 0" /></template>
    <template v-else-if="name === 'arrow'"><path d="M4 12h15m-6-6 6 6-6 6" /></template>
    <template v-else-if="name === 'external'"><path d="M14 4h6v6m0-6L10 14M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" /></template>
    <template v-else-if="name === 'patrol'"><path d="m4 14 8 4 8-4-2 6H6l-2-6ZM12 3v11m-5-3 5-8 5 8H7Z" /></template>
    <template v-else-if="name === 'water'"><path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M9 16a3 3 0 0 0 3 3" /></template>
    <template v-else-if="name === 'leaf'"><path d="M20 3S5 2 4 12a7 7 0 0 0 8 8C22 18 20 3 20 3ZM3 22l12-13" /></template>
    <template v-else-if="name === 'book'"><path d="M12 5v16M3 4c5-1 7 0 9 2 2-2 4-3 9-2v15c-5-1-7 0-9 2-2-2-4-3-9-2V4Z" /></template>
    <template v-else-if="name === 'map'"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5ZM9 3v16m6-14v16" /></template>
    <template v-else-if="name === 'voice'"><rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8" /></template>
    <template v-else-if="name === 'chart'"><path d="M4 3v17h17M8 15v-5m5 5V6m5 9v-7" /></template>
    <template v-else-if="name === 'calendar'"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 5h2m4 0h2" /></template>
    <template v-else-if="name === 'search'"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6" /></template>
    <template v-else-if="name === 'download'"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></template>
    <template v-else-if="name === 'location'"><path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0Z"/><circle cx="12" cy="9" r="2" /></template>
    <template v-else-if="name === 'plus'"><path d="M12 4v16M4 12h16" /></template>
    <template v-else-if="name === 'close'"><path d="m5 5 14 14M5 19 19 5" /></template>
    <template v-else><rect x="4" y="3" width="16" height="19" rx="2"/><path d="M8 8h8m-8 5h8m-8 5h5" /></template>
  </svg>
</template>
<script setup>defineProps({ name: { type: String, default: 'file' } })</script>

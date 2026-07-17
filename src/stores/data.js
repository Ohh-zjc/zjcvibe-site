import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, supabaseConfigured } from '../lib/supabase'
import interviewsJson from '../data/interviews.json'
import geoJson from '../data/geo.json'
import dashboardJson from '../data/dashboard.json'
import educationJson from '../data/education.json'

export const useDataStore = defineStore('data', () => {
  // 本地缓存（Supabase 未配置时的 fallback 或初始值）
  const interviews = ref([...interviewsJson])
  const geo = ref({ ...geoJson })
  const dashboard = ref({ ...dashboardJson })
  const education = ref({ ...educationJson })
  const loading = ref(false)
  const supabaseReady = ref(false)

  // ---- 从 Supabase 加载全部数据 ----
  async function loadFromSupabase() {
    if (!supabaseConfigured) {
      supabaseReady.value = false
      return  // 未配置，静默跳过，使用 JSON fallback
    }
    loading.value = true
    try {
      const results = await Promise.all([
        supabase.from('interviews').select('*').order('id'),
        supabase.from('geo_points').select('*'),
        supabase.from('geo_patrol').select('*').limit(1).single(),
        supabase.from('dashboard').select('*').limit(1).single(),
        supabase.from('quiz').select('*').order('id'),
        supabase.from('feedback').select('*').order('created_at'),
        supabase.from('artworks').select('*').order('created_at'),
        supabase.from('classrooms').select('*'),
      ])

      // interviews
      if (results[0].data?.length) {
        interviews.value = results[0].data.map(r => ({
          id: r.id,
          name: r.name,
          identity: r.identity,
          summary: r.summary,
          quote: r.quote,
          photo: r.photo || '/img/placeholder-person.jpg',
          audio: r.audio,
          audio_segments: r.audio_segments || [],
          transcript: r.transcript || '',
          photos: r.photos || ['/img/placeholder-person.jpg'],
          timeline: r.timeline || [],
          waveform: r.waveform,
          sentiment: r.sentiment,
          keywords: r.keywords || [],
        }))
      }

      // geo points + patrol
      if (results[1].data?.length) {
        const fallbackPoints = new Map(geoJson.points.map(point => [point.id, point]))
        geo.value.points = results[1].data.map(p => {
          const fallback = fallbackPoints.get(p.id) || {}
          return {
            ...fallback,
            id: p.id,
            name: p.name,
            lat: p.lat ?? fallback.lat,
            lng: p.lng ?? fallback.lng,
            displayLat: p.lat ?? fallback.displayLat,
            displayLng: p.lng ?? fallback.displayLng,
            description: p.description || fallback.description || '',
            beforeImg: p.before_img || fallback.beforeImg || '',
            afterImg: p.after_img || fallback.afterImg || '',
          }
        })
      }
      if (results[2].data) {
        geo.value.patrol_track = results[2].data.track || []
        geo.value.fishermen_points = results[2].data.fishermen_points || []
      }

      // dashboard
      if (results[3].data) {
        const d = results[3].data
        dashboard.value = {
          water_quality: d.water_quality || dashboardJson.water_quality,
          vegetation: d.vegetation || dashboardJson.vegetation,
          ndvi: d.ndvi || dashboardJson.ndvi,
          cleanup: d.cleanup || dashboardJson.cleanup,
          patrol: d.patrol || dashboardJson.patrol,
          finless_porpoise: d.finless_porpoise || [],
          field_sample: d.field_sample || dashboardJson.field_sample,
          porpoise: d.porpoise || dashboardJson.porpoise,
          remote_sensing: d.remote_sensing || dashboardJson.remote_sensing,
        }
      }

      // education
      if (results[4].data?.length) {
        education.value.quiz = results[4].data.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation || '',
        }))
      }
      if (results[5].data) education.value.feedback = results[5].data
      if (results[6].data) education.value.artworks = results[6].data.map(a => a.image_url)
      if (results[7].data) education.value.classrooms = results[7].data

      supabaseReady.value = true
    } catch {
      // Supabase 不可用，使用 JSON fallback（已在 ref 初始值中）
      supabaseReady.value = false
    }
    loading.value = false
  }

  // ---- 上传图片到 Supabase Storage ----
  async function uploadImage(file, bucket = 'images') {
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from(bucket).upload(path, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
      return urlData.publicUrl
    } catch {
      // Fallback: base64
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    }
  }

  // ---- CRUD: 口述史 ----
  async function saveInterview(person) {
    const row = {
      id: person.id,
      name: person.name,
      identity: person.identity,
      summary: person.summary,
      quote: person.quote,
      photo: person.photo,
      audio: person.audio,
      audio_segments: person.audio_segments || [],
      transcript: person.transcript || '',
      photos: person.photos || [],
      timeline: person.timeline || [],
      waveform: person.waveform,
      sentiment: person.sentiment,
      keywords: person.keywords || [],
      updated_at: new Date().toISOString(),
    }
    try {
      const { error } = await supabase.from('interviews').upsert(row)
      if (!error) {
        const idx = interviews.value.findIndex(i => i.id === person.id)
        if (idx >= 0) interviews.value[idx] = person
        else interviews.value.push(person)
      }
    } catch { /* fallback */ }
  }

  async function deleteInterview(id) {
    try {
      await supabase.from('interviews').delete().eq('id', id)
    } catch {}
    interviews.value = interviews.value.filter(i => i.id !== id)
  }

  // ---- CRUD: 岸线点位 ----
  async function saveGeoPoint(point) {
    const row = {
      id: point.id,
      name: point.name,
      lat: point.lat,
      lng: point.lng,
      description: point.description || '',
      before_img: point.beforeImg || '',
      after_img: point.afterImg || '',
    }
    try {
      await supabase.from('geo_points').upsert(row)
    } catch {}
    const idx = geo.value.points.findIndex(p => p.id === point.id)
    if (idx >= 0) geo.value.points[idx] = point
    else geo.value.points.push(point)
  }

  async function deleteGeoPoint(id) {
    try { await supabase.from('geo_points').delete().eq('id', id) } catch {}
    geo.value.points = geo.value.points.filter(p => p.id !== id)
  }

  async function savePatrolTrack(track) {
    try {
      await supabase.from('geo_patrol').upsert({ id: 1, track })
    } catch {}
    geo.value.patrol_track = track
  }

  // ---- CRUD: 数据看板 ----
  async function saveDashboard(data) {
    try {
      await supabase.from('dashboard').upsert({
        id: 1,
        water_quality: data.water_quality,
        vegetation: data.vegetation,
        ndvi: data.ndvi,
        cleanup: data.cleanup,
        patrol: data.patrol,
        finless_porpoise: data.finless_porpoise || [],
      })
    } catch {}
    dashboard.value = { ...data }
  }

  // ---- CRUD: 教育数据 ----
  async function saveQuizItem(quizItem) {
    const { id, ...rest } = quizItem
    try {
      if (id) {
        await supabase.from('quiz').update(rest).eq('id', id)
      } else {
        await supabase.from('quiz').insert(rest)
      }
    } catch {}
    await reloadQuiz()
  }

  async function deleteQuizItem(id) {
    try { await supabase.from('quiz').delete().eq('id', id) } catch {}
    education.value.quiz = education.value.quiz.filter(q => q.id !== id)
  }

  async function saveFeedback(feedbackList) {
    try {
      await supabase.from('feedback').delete().neq('id', 0) // clear all
      if (feedbackList.length) {
        await supabase.from('feedback').insert(feedbackList)
      }
    } catch {}
    education.value.feedback = feedbackList
  }

  async function saveArtworks(artworks) {
    try {
      await supabase.from('artworks').delete().neq('id', 0)
      if (artworks.length) {
        await supabase.from('artworks').insert(artworks.map(url => ({ image_url: url })))
      }
    } catch {}
    education.value.artworks = artworks
  }

  async function saveClassrooms(classrooms) {
    try {
      for (const c of classrooms) {
        await supabase.from('classrooms').upsert(c)
      }
    } catch {}
    education.value.classrooms = classrooms
  }

  async function saveEducation(data) {
    try {
      // Save classrooms
      if (data.classrooms?.length) {
        for (const c of data.classrooms) {
          await supabase.from('classrooms').upsert(c)
        }
      }
    } catch {}
    education.value = { ...data }
  }

  // 重新加载答题（quiz insert 后 id 由数据库生成，需要刷新）
  async function reloadQuiz() {
    try {
      const { data } = await supabase.from('quiz').select('*').order('id')
      if (data?.length) {
        education.value.quiz = data.map(q => ({
          id: q.id, question: q.question, options: q.options,
          answer: q.answer, explanation: q.explanation || '',
        }))
      }
    } catch {}
  }

  // ---- 导出/清除 ----
  function exportEdits() {
    return JSON.stringify({
      interviews: interviews.value,
      geo: geo.value,
      dashboard: dashboard.value,
      education: education.value,
    }, null, 2)
  }

  function clearEdits() {
    interviews.value = [...interviewsJson]
    geo.value = { ...geoJson }
    dashboard.value = { ...dashboardJson }
    education.value = { ...educationJson }
  }

  // 启动时加载
  loadFromSupabase()

  return {
    interviews, geo, dashboard, education, loading, supabaseReady,
    loadFromSupabase, uploadImage,
    saveInterview, deleteInterview,
    saveGeoPoint, deleteGeoPoint, savePatrolTrack,
    saveDashboard,
    saveQuizItem, deleteQuizItem, saveFeedback, saveArtworks, saveClassrooms,
    saveEducation, reloadQuiz,
    exportEdits, clearEdits,
  }
})

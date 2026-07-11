import { createClient } from '@supabase/supabase-js'

// ============================================
// 🔧 部署到 Supabase 后再修改这里
// 从 Supabase Dashboard → Settings → API 获取
// ============================================
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// 检查是否已配置
export const supabaseConfigured = !SUPABASE_URL.includes('YOUR-PROJECT')

// 创建客户端（未配置时返回一个静默失败的 mock）
export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createMockClient()

function createMockClient() {
  const noop = () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') })
  return {
    auth: { getSession: noop, signInWithPassword: noop, signUp: noop, signOut: noop },
    from: () => ({ select: () => noop(), insert: () => noop(), update: () => noop(), delete: () => noop(), upsert: () => noop(), eq: () => noop(), neq: () => noop(), order: () => noop(), limit: () => noop(), single: () => noop(), }),
    storage: { from: () => ({ upload: noop, getPublicUrl: () => ({ publicUrl: '' }) }) },
  }
}

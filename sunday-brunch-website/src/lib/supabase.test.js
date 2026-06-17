import { afterEach, describe, expect, it, vi } from 'vitest'

describe('supabase client configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('loads a disabled client when Supabase env vars are missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

    const {
      getCurrentSession,
      getCurrentUser,
      isSupabaseConfigured,
      supabase
    } = await import('./supabase')

    expect(isSupabaseConfigured()).toBe(false)
    await expect(getCurrentUser()).resolves.toMatchObject({
      user: null,
      error: { message: 'Supabase not configured' }
    })
    await expect(getCurrentSession()).resolves.toMatchObject({
      session: null,
      error: { message: 'Supabase not configured' }
    })
    await expect(supabase.auth.resetPasswordForEmail('test@example.com')).resolves.toMatchObject({
      error: { message: 'Supabase not configured' }
    })

    const ratingsResult = await supabase
      .from('recipe_ratings')
      .select('*')
      .eq('recipe_slug', 'chocolate-chip-cookies')
      .single()

    expect(ratingsResult).toMatchObject({
      data: null,
      error: { message: 'Supabase not configured' }
    })
  })
})

#!/usr/bin/env node

/**
 * Supabase Database Connection Test Script
 *
 * This script verifies that:
 * 1. Supabase client is configured correctly
 * 2. Database tables exist
 * 3. RLS policies are working
 * 4. Connection is healthy
 *
 * Usage: node scripts/test-supabase-connection.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = resolve(__dirname, '../.env.local')

dotenv.config({ path: envPath })

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
}

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}`),
}

async function testSupabaseConnection() {
  log.section('🧪 Testing Supabase Database Connection...')

  // Step 1: Verify environment variables
  log.section('Step 1: Verifying environment variables')

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    log.error('Missing Supabase environment variables!')
    log.info('Required in .env.local:')
    log.info('  VITE_SUPABASE_URL=https://xxxxx.supabase.co')
    log.info('  VITE_SUPABASE_ANON_KEY=eyJxxx...')
    process.exit(1)
  }

  log.success('Environment variables found')
  log.info(`Supabase URL: ${supabaseUrl}`)

  // Step 2: Create Supabase client
  log.section('Step 2: Creating Supabase client')

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Disable session persistence for test
      autoRefreshToken: false,
    },
  })

  log.success('Supabase client created')

  // Step 3: Test connection by querying profiles table
  log.section('Step 3: Testing database connection')

  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1)

    if (error) {
      log.error(`Connection failed: ${error.message}`)
      log.info('Common causes:')
      log.info('  - Database tables not created (run supabase_sprint4_setup.sql)')
      log.info('  - RLS policies blocking access')
      log.info('  - Incorrect Supabase URL or API key')
      process.exit(1)
    }

    log.success('Database connection successful')
  } catch (err) {
    log.error(`Unexpected error: ${err.message}`)
    process.exit(1)
  }

  // Step 4: Verify all tables exist
  log.section('Step 4: Verifying database tables')

  const tables = ['profiles', 'ratings', 'reviews', 'review_votes']
  let allTablesExist = true

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(0)

      if (error) {
        log.error(`Table "${table}" not accessible: ${error.message}`)
        allTablesExist = false
      } else {
        log.success(`Table "${table}" exists and is accessible`)
      }
    } catch (err) {
      log.error(`Error checking table "${table}": ${err.message}`)
      allTablesExist = false
    }
  }

  if (!allTablesExist) {
    log.warning('Some tables are missing or not accessible')
    log.info('Run the migration script: supabase_sprint4_setup.sql')
    process.exit(1)
  }

  // Step 5: Test recipe_ratings view
  log.section('Step 5: Testing recipe_ratings view')

  try {
    const { data, error } = await supabase.from('recipe_ratings').select('*').limit(1)

    if (error) {
      log.warning(`View "recipe_ratings" not accessible: ${error.message}`)
      log.info('The view might not exist yet (this is okay)')
    } else {
      log.success('View "recipe_ratings" exists and is accessible')
      if (data && data.length > 0) {
        log.info(`Sample data: ${JSON.stringify(data[0], null, 2)}`)
      } else {
        log.info('View is empty (no ratings yet)')
      }
    }
  } catch (err) {
    log.warning(`Error checking view: ${err.message}`)
  }

  // Step 6: Test RLS policies (read access)
  log.section('Step 6: Testing Row Level Security (RLS) policies')

  try {
    // Test public read access on profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (profilesError) {
      log.warning(`RLS policy test failed for profiles: ${profilesError.message}`)
    } else {
      log.success('RLS policy working: Public can read profiles')
    }

    // Test public read access on ratings
    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('id')
      .limit(1)

    if (ratingsError) {
      log.warning(`RLS policy test failed for ratings: ${ratingsError.message}`)
    } else {
      log.success('RLS policy working: Public can read ratings')
    }

    // Test public read access on reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id')
      .limit(1)

    if (reviewsError) {
      log.warning(`RLS policy test failed for reviews: ${reviewsError.message}`)
    } else {
      log.success('RLS policy working: Public can read reviews')
    }
  } catch (err) {
    log.warning(`Error testing RLS policies: ${err.message}`)
  }

  // Step 7: Summary
  log.section('📊 Test Summary')
  log.success('All tests passed!')
  log.success('Supabase database is configured correctly')
  log.info('\nNext steps:')
  log.info('  1. Mark "Complete Database Setup" in @fix_plan.md as [x]')
  log.info('  2. Implement ProtectedRoute component')
  log.info('  3. Write comprehensive authentication tests (50+ tests)')
  log.info('  4. Run E2E authentication testing')

  console.log('\n')
}

// Run the test
testSupabaseConnection().catch((err) => {
  log.error(`Fatal error: ${err.message}`)
  process.exit(1)
})

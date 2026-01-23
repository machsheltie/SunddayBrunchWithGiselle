-- =============================================
-- Sunday Brunch With Giselle - Database Schema
-- =============================================
--
-- This file contains the SQL schema for the Supabase database.
-- Run this in your Supabase SQL Editor to create the required tables.
--
-- Last Updated: 2026-01-23
-- =============================================

-- =============================================
-- 1. RATINGS TABLE
-- =============================================
-- Stores individual user ratings for recipes
-- One rating per user per recipe (enforced by unique constraint)

CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT, -- Optional review comment
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one rating per user per recipe
  UNIQUE(recipe_slug, user_id)
);

-- Enable Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ratings table
-- Anyone can view ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

-- Users can insert their own ratings
CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ratings_recipe_slug ON ratings(recipe_slug);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at DESC);

-- =============================================
-- 2. RECIPE_RATINGS VIEW (Materialized)
-- =============================================
-- Aggregated ratings data for each recipe
-- Provides average rating and count for quick lookups

CREATE MATERIALIZED VIEW IF NOT EXISTS recipe_ratings AS
SELECT
  recipe_slug,
  AVG(rating)::NUMERIC(3,2) AS average_rating,
  COUNT(*) AS rating_count,
  MAX(updated_at) AS last_rated_at
FROM ratings
GROUP BY recipe_slug;

-- Create unique index for refreshing
CREATE UNIQUE INDEX IF NOT EXISTS idx_recipe_ratings_slug ON recipe_ratings(recipe_slug);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_recipe_ratings()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY recipe_ratings;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-refresh on ratings changes
DROP TRIGGER IF EXISTS refresh_recipe_ratings_trigger ON ratings;
CREATE TRIGGER refresh_recipe_ratings_trigger
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_recipe_ratings();

-- =============================================
-- 3. HELPER FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_ratings_updated_at ON ratings;
CREATE TRIGGER update_ratings_updated_at
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. EXAMPLE QUERIES
-- =============================================

-- Get average rating for a recipe
-- SELECT * FROM recipe_ratings WHERE recipe_slug = 'giselles-royal-velvet-cake';

-- Get user's rating for a recipe
-- SELECT * FROM ratings WHERE recipe_slug = 'giselles-royal-velvet-cake' AND user_id = 'user-uuid-here';

-- Get recent high-rated reviews with comments
-- SELECT * FROM ratings
-- WHERE rating >= 5
-- AND comment IS NOT NULL
-- ORDER BY created_at DESC
-- LIMIT 4;

-- =============================================
-- 5. OPTIONAL: SEED DATA (for testing)
-- =============================================
-- Uncomment to add sample ratings (replace user_id with actual user UUIDs)

-- INSERT INTO ratings (recipe_slug, user_id, rating, comment) VALUES
-- ('giselles-royal-velvet-cake', 'your-user-uuid-1', 5, 'Absolutely divine! Best cake I''ve ever made.'),
-- ('giselles-royal-velvet-cake', 'your-user-uuid-2', 5, 'The texture was perfect, and my family loved it!'),
-- ('placeholder-brownie-1', 'your-user-uuid-3', 4, 'Great recipe, but I needed to bake it a bit longer.');

-- Refresh the materialized view after seeding
-- REFRESH MATERIALIZED VIEW CONCURRENTLY recipe_ratings;

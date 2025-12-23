-- Sunday Brunch Backend Database Schema

-- Drop existing tables if they exist (for clean migrations)
DROP TABLE IF EXISTS related_content CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;

-- Recipes table
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    story TEXT[],
    prep_time VARCHAR(50),
    cook_time VARCHAR(50),
    total_time VARCHAR(50),
    yield VARCHAR(100),
    ingredients TEXT[],
    steps TEXT[],
    meta_description TEXT,
    meta_og_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Episodes table
CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    audio_url VARCHAR(500),
    transcript TEXT,
    notes TEXT[],
    meta_description TEXT,
    meta_og_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tools table (for recipe tools/equipment)
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    link VARCHAR(500),
    category VARCHAR(100)
);

-- Related content table (polymorphic relationships)
CREATE TABLE related_content (
    id SERIAL PRIMARY KEY,
    source_type VARCHAR(50) NOT NULL, -- 'recipe' or 'episode'
    source_id INTEGER NOT NULL,
    related_type VARCHAR(50) NOT NULL, -- 'recipe', 'episode', or 'collection'
    related_slug VARCHAR(255) NOT NULL,
    related_title VARCHAR(255) NOT NULL,
    relation_category VARCHAR(50) -- 'related' or 'seasonal'
);

-- Indexes for performance
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_episodes_slug ON episodes(slug);
CREATE INDEX idx_tools_recipe_id ON tools(recipe_id);
CREATE INDEX idx_related_content_source ON related_content(source_type, source_id);

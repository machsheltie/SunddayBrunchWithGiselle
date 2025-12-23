import pool from '../config/database.js';

export const Recipe = {
  /**
   * Get all recipes
   */
  async findAll() {
    const result = await pool.query(`
      SELECT
        id, slug, title, story,
        prep_time, cook_time, total_time, yield,
        ingredients, steps,
        meta_description, meta_og_image,
        created_at, updated_at
      FROM recipes
      ORDER BY created_at DESC
    `);

    return result.rows;
  },

  /**
   * Get recipe by slug with related data (tools, related content)
   */
  async findBySlug(slug) {
    const recipeResult = await pool.query(`
      SELECT
        id, slug, title, story,
        prep_time, cook_time, total_time, yield,
        ingredients, steps,
        meta_description, meta_og_image,
        created_at, updated_at
      FROM recipes
      WHERE slug = $1
    `, [slug]);

    if (recipeResult.rows.length === 0) {
      return null;
    }

    const recipe = recipeResult.rows[0];

    // Get tools for this recipe
    const toolsResult = await pool.query(`
      SELECT name, link, category
      FROM tools
      WHERE recipe_id = $1
    `, [recipe.id]);

    // Get related content
    const relatedResult = await pool.query(`
      SELECT related_type, related_slug, related_title, relation_category
      FROM related_content
      WHERE source_type = 'recipe' AND source_id = $1
    `, [recipe.id]);

    // Format the response to match frontend expectations
    const formattedRecipe = {
      slug: recipe.slug,
      title: recipe.title,
      story: recipe.story,
      times: {
        prep: recipe.prep_time,
        cook: recipe.cook_time,
        total: recipe.total_time
      },
      yield: recipe.yield,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      tools: toolsResult.rows.map(tool => ({
        name: tool.name,
        link: tool.link,
        category: tool.category
      })),
      related: relatedResult.rows
        .filter(r => r.relation_category === 'related')
        .map(r => ({
          title: r.related_title,
          slug: r.related_slug,
          type: r.related_type
        })),
      seasonal: relatedResult.rows
        .filter(r => r.relation_category === 'seasonal')
        .map(r => ({
          title: r.related_title,
          slug: r.related_slug,
          type: r.related_type
        })),
      meta: {
        description: recipe.meta_description,
        ogImage: recipe.meta_og_image
      }
    };

    return formattedRecipe;
  }
};

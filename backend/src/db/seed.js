import pool from '../config/database.js';

const seedData = {
  recipes: [
    {
      slug: 'french-silk-pie',
      title: 'French Silk Pie',
      story: [
        'This pie was the "too much" dessert that became my signature. It is rich, unapologetic, and the one that turned family skepticism into "more, please."',
        'Make the story your own - this is where you pull listeners into the kitchen and set the mood before they jump to the recipe.'
      ],
      prep_time: '30 min',
      cook_time: '10 min',
      total_time: '40 min',
      yield: '1 pie (8 slices)',
      ingredients: [
        '1.5 cups graham cracker crumbs',
        '1/4 cup sugar',
        '1/3 cup melted butter',
        '1 cup unsalted butter, softened',
        '1.5 cups sugar',
        '4 oz unsweetened chocolate, melted and cooled',
        '2 tsp real vanilla extract',
        '4 pasteurized eggs',
        '2 cups heavy whipping cream'
      ],
      steps: [
        'Preheat oven to 375F. Mix crumbs, 1/4 cup sugar, melted butter. Press into 9" pie pan. Bake 10 minutes; cool completely.',
        'Beat softened butter until fluffy. Gradually add 1.5 cups sugar until light. Blend in cooled chocolate and vanilla.',
        'Add eggs one at a time, beating 5 minutes after each addition on medium. Pour into cooled crust.',
        'Whip cream to soft peaks. Spread over filling. Chill at least 4 hours (overnight better).',
        'Garnish with chocolate curls. Serve chilled.'
      ],
      meta_description: 'French Silk Pie with a story-rich intro and step-by-step guidance.',
      meta_og_image: '/images/french-silk-pie.svg',
      tools: [
        { name: '9" pie pan', link: '#', category: 'baking' },
        { name: 'Hand/stand mixer', link: '#', category: 'kitchen' },
        { name: 'Offset spatula', link: '#', category: 'kitchen' }
      ],
      related: [
        { title: 'Episode 2: Cinnamon Rolls', slug: 'cinnamon-rolls', type: 'episode' },
        { title: 'Recipe: Cinnamon Rolls', slug: 'cinnamon-rolls-recipe', type: 'recipe' }
      ],
      seasonal: [
        { title: 'Holiday Comforts', slug: 'holiday-comforts', type: 'collection' }
      ]
    }
  ],
  episodes: [
    {
      slug: 'the-pie-that-started-a-dynasty',
      title: 'Episode 1: The Pie That Started a Dynasty',
      audio_url: '#',
      transcript: 'Transcript placeholder. Insert full transcript or captions here.',
      notes: [
        'Show notes go here: links, shoutouts, and recipe tie-in.',
        'Include timestamps/chapters if desired.'
      ],
      meta_description: 'Story and baking walk-through for the French Silk Pie episode.',
      meta_og_image: '/images/french-silk-pie.svg',
      relatedRecipes: [
        { title: 'French Silk Pie (recipe)', slug: 'french-silk-pie', type: 'recipe' }
      ],
      relatedEpisodes: [
        { title: 'Episode 2: Cinnamon Rolls', slug: 'cinnamon-rolls', type: 'episode' }
      ]
    }
  ]
};

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('🌱 Seeding database...');

    await client.query('BEGIN');

    // Seed recipes
    for (const recipe of seedData.recipes) {
      const { tools, related, seasonal, ...recipeData } = recipe;

      const recipeResult = await client.query(
        `INSERT INTO recipes (slug, title, story, prep_time, cook_time, total_time, yield, ingredients, steps, meta_description, meta_og_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          recipeData.slug,
          recipeData.title,
          recipeData.story,
          recipeData.prep_time,
          recipeData.cook_time,
          recipeData.total_time,
          recipeData.yield,
          recipeData.ingredients,
          recipeData.steps,
          recipeData.meta_description,
          recipeData.meta_og_image
        ]
      );

      const recipeId = recipeResult.rows[0].id;
      console.log(`  ✓ Recipe: ${recipe.title} (ID: ${recipeId})`);

      // Seed tools
      for (const tool of tools) {
        await client.query(
          'INSERT INTO tools (recipe_id, name, link, category) VALUES ($1, $2, $3, $4)',
          [recipeId, tool.name, tool.link, tool.category]
        );
      }

      // Seed related content
      for (const item of related) {
        await client.query(
          `INSERT INTO related_content (source_type, source_id, related_type, related_slug, related_title, relation_category)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['recipe', recipeId, item.type, item.slug, item.title, 'related']
        );
      }

      // Seed seasonal content
      for (const item of seasonal) {
        await client.query(
          `INSERT INTO related_content (source_type, source_id, related_type, related_slug, related_title, relation_category)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['recipe', recipeId, item.type, item.slug, item.title, 'seasonal']
        );
      }
    }

    // Seed episodes
    for (const episode of seedData.episodes) {
      const { relatedRecipes, relatedEpisodes, ...episodeData } = episode;

      const episodeResult = await client.query(
        `INSERT INTO episodes (slug, title, audio_url, transcript, notes, meta_description, meta_og_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          episodeData.slug,
          episodeData.title,
          episodeData.audio_url,
          episodeData.transcript,
          episodeData.notes,
          episodeData.meta_description,
          episodeData.meta_og_image
        ]
      );

      const episodeId = episodeResult.rows[0].id;
      console.log(`  ✓ Episode: ${episode.title} (ID: ${episodeId})`);

      // Seed related recipes
      for (const item of relatedRecipes) {
        await client.query(
          `INSERT INTO related_content (source_type, source_id, related_type, related_slug, related_title, relation_category)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['episode', episodeId, item.type, item.slug, item.title, 'related']
        );
      }

      // Seed related episodes
      for (const item of relatedEpisodes) {
        await client.query(
          `INSERT INTO related_content (source_type, source_id, related_type, related_slug, related_title, relation_category)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['episode', episodeId, item.type, item.slug, item.title, 'related']
        );
      }
    }

    await client.query('COMMIT');

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Seeded: ${seedData.recipes.length} recipes, ${seedData.episodes.length} episodes`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();

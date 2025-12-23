import pool from '../config/database.js';

export const Episode = {
  /**
   * Get all episodes
   */
  async findAll() {
    const result = await pool.query(`
      SELECT
        id, slug, title, audio_url, transcript, notes,
        meta_description, meta_og_image,
        created_at, updated_at
      FROM episodes
      ORDER BY created_at DESC
    `);

    return result.rows;
  },

  /**
   * Get episode by slug with related content
   */
  async findBySlug(slug) {
    const episodeResult = await pool.query(`
      SELECT
        id, slug, title, audio_url, transcript, notes,
        meta_description, meta_og_image,
        created_at, updated_at
      FROM episodes
      WHERE slug = $1
    `, [slug]);

    if (episodeResult.rows.length === 0) {
      return null;
    }

    const episode = episodeResult.rows[0];

    // Get related content
    const relatedResult = await pool.query(`
      SELECT related_type, related_slug, related_title
      FROM related_content
      WHERE source_type = 'episode' AND source_id = $1
    `, [episode.id]);

    // Format the response to match frontend expectations
    const formattedEpisode = {
      slug: episode.slug,
      title: episode.title,
      audioUrl: episode.audio_url,
      transcript: episode.transcript,
      notes: episode.notes,
      relatedRecipes: relatedResult.rows
        .filter(r => r.related_type === 'recipe')
        .map(r => ({
          title: r.related_title,
          slug: r.related_slug,
          type: r.related_type
        })),
      relatedEpisodes: relatedResult.rows
        .filter(r => r.related_type === 'episode')
        .map(r => ({
          title: r.related_title,
          slug: r.related_slug,
          type: r.related_type
        })),
      meta: {
        description: episode.meta_description,
        ogImage: episode.meta_og_image
      }
    };

    return formattedEpisode;
  }
};

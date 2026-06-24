export { recipes } from './recipes'

// Designed sample episode (isSample: true) mirroring the expanded-episode
// content in preview-magical.html (#episodeExpanded).
export const episodes = [
    {
        slug: 'the-pie-that-started-a-dynasty',
        title: 'Episode 1: The Pie That Started a Dynasty',
        isSample: true,
        audioUrl: '#',
        transcript: 'Transcript placeholder. Insert full transcript or captions here.',
        airedOn: 'Sunday Morning',
        duration: '32 minutes',
        notes: [
            'The legendary Sunday morning that started it all',
            'How one apple pie became a weekly tradition',
            "The Shelties' first taste test (chaos ensued)",
            'Building a community around Sunday baking',
            'Why precision and whimsy can coexist'
        ],
        relatedRecipes: [
            { title: 'French Silk Pie', slug: 'french-silk-pie', type: 'recipe' }
        ],
        relatedEpisodes: [
            { title: 'Mastering the Perfect Pie Crust', description: 'Flaky, buttery, foolproof', slug: 'mastering-pie-crust', type: 'episode' },
            { title: 'The Apple Varietals Guide', description: 'Choosing the right apples', slug: 'apple-varieties', type: 'episode' },
            { title: 'Sheltie Taste Test Chronicles', description: 'When dogs judge your bakes', slug: 'sheltie-taste-tests', type: 'episode' }
        ],
        meta: {
            description: 'Story and baking walk-through placeholder.',
            ogImage: '/images/placeholder.svg'
        }
    }
]

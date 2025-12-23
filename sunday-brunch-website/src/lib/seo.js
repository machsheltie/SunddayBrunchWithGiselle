const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://sundaybrunchwithgiselle.com'

const ensureMeta = (name, attr = 'name') => {
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
    }
    return el
}

const setCanonical = (canonical) => {
    if (!canonical) return
    const url = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
    }
    link.setAttribute('href', url)
}

const setStructuredData = (schema) => {
    let script = document.getElementById('structured-data')
    if (!script) {
        script = document.createElement('script')
        script.id = 'structured-data'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(schema)
}

export const applyMeta = ({ title, description, ogImage, canonical }) => {
    if (title) document.title = title

    if (description) {
        const desc = ensureMeta('description')
        desc.setAttribute('content', description)
    }

    if (ogImage) {
        const ogImg = ensureMeta('og:image', 'property')
        const normalized = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`
        ogImg.setAttribute('content', normalized)
    }

    setCanonical(canonical)
}

const asDuration = (time) => {
    if (!time) return undefined
    // Expect strings like "30 min" -> PT30M
    const minutes = parseInt(time, 10)
    return Number.isNaN(minutes) ? undefined : `PT${minutes}M`
}

export const applyRecipeSchema = (recipe) => {
    if (!recipe) return
    const schema = {
        '@context': 'https://schema.org/',
        '@type': 'Recipe',
        name: recipe.title,
        description: recipe.meta?.description || recipe.story?.[0],
        image: recipe.meta?.ogImage ? `${SITE_URL}${recipe.meta.ogImage}` : undefined,
        recipeYield: recipe.yield,
        prepTime: asDuration(recipe.times?.prep),
        cookTime: asDuration(recipe.times?.cook),
        totalTime: asDuration(recipe.times?.total),
        recipeIngredient: recipe.ingredients,
        recipeInstructions: recipe.steps?.map((step) => ({ '@type': 'HowToStep', text: step })),
        tool: recipe.tools?.map((tool) => tool.name),
        keywords: recipe.seasonal?.map((item) => item.title) || []
    }
    setStructuredData(schema)
}

export const applyEpisodeSchema = (episode) => {
    if (!episode) return
    const schema = {
        '@context': 'https://schema.org/',
        '@type': 'PodcastEpisode',
        name: episode.title,
        description: episode.meta?.description,
        url: `${SITE_URL}/episodes/${episode.slug}`,
        associatedMedia: episode.audioUrl ? {
            '@type': 'AudioObject',
            contentUrl: episode.audioUrl
        } : undefined
    }
    setStructuredData(schema)
}

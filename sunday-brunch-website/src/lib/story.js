const normalizeWhitespace = (value) => String(value).replace(/\s+/g, ' ').trim()

const stripInlineMarkdown = (value) =>
    normalizeWhitespace(value)
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')

const parseStoryBody = (body) => {
    if (!body) {
        return []
    }

    return String(body)
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
            const isQuote = block.startsWith('>')
            const text = block
                .split('\n')
                .map((line) => line.replace(/^>\s?/, ''))
                .join(' ')

            return {
                type: isQuote ? 'quote' : 'paragraph',
                text: stripInlineMarkdown(text)
            }
        })
        .filter((block) => block.text)
}

export const getStoryPresentation = (story) => {
    if (!story) {
        return {
            headline: null,
            blocks: []
        }
    }

    if (Array.isArray(story)) {
        return {
            headline: null,
            blocks: story
                .filter(Boolean)
                .map((paragraph) => ({
                    type: 'paragraph',
                    text: stripInlineMarkdown(paragraph)
                }))
        }
    }

    if (typeof story === 'string') {
        return {
            headline: null,
            blocks: parseStoryBody(story)
        }
    }

    return {
        headline: story.headline || null,
        blocks: parseStoryBody(story.body)
    }
}

export const getStoryExcerpt = (story) => {
    const { blocks } = getStoryPresentation(story)
    const firstParagraph = blocks.find((block) => block.type === 'paragraph')

    return (firstParagraph || blocks[0])?.text || ''
}

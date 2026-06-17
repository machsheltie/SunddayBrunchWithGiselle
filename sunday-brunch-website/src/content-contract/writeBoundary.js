const canonicalWriters = new Set([
    'canonical-editor',
    'controlled-migration'
])

export const assertCanonicalWrite = (source) => {
    if (!canonicalWriters.has(source)) {
        throw new Error('Projection sources cannot write canonical content')
    }
}

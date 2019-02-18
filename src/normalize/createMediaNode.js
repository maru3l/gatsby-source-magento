import extensionAttributes from './extensionAttributes'

export default function(createNodeId, entities) {
  // image
  // media_gallery_entries
  // small_image
  // thumbnail
  // swatch_image

  let medias = []

  const addToArray = (baseURL, path) => {
    const sourceUrl = `${baseURL}catalog/product${path}`
    const id = createNodeId(`magento__media-${path}`)

    if (
      medias.findIndex(({ file_path: filePath }) => filePath === path) === -1
    ) {
      const obj = {
        id,
        source_url: sourceUrl,
        file_path: path,
        parent: null,
        children: [],
        __type: 'magento__media',
      }

      medias = [...medias, obj]
    }
    return id
  }

  entities = entities.map(cur => {
    if (cur.__type === 'magento__product') {
      const baseURL = entities.find(e => e.id === cur.storeViewConfig___NODE)
        .secure_base_media_url

      if (cur.image) {
        const id = addToArray(baseURL, cur.image)

        cur.image___NODE = id

        delete cur.image
      }

      if (cur.small_image) {
        const id = addToArray(baseURL, cur.small_image)

        cur.small_image___NODE = id

        delete cur.small_image
      }

      if (cur.thumbnail) {
        const id = addToArray(baseURL, cur.thumbnail)

        cur.thumbnail___NODE = id

        delete cur.thumbnail
      }

      if (cur.swatch_image) {
        const id = addToArray(baseURL, cur.swatch_image)

        cur.swatch_image___NODE = id

        delete cur.swatch_image
      }

      if (cur.media_gallery_entries && cur.media_gallery_entries.length > 0) {
        cur.media_gallery_entries = extensionAttributes(
          cur.media_gallery_entries,
        )

        cur.media_gallery_entries.forEach(e => {
          const id = addToArray(baseURL, e.file)

          e.file___NODE = id

          delete e.file
        })
      }
    }

    return cur
  })

  return [...entities, ...medias]
}

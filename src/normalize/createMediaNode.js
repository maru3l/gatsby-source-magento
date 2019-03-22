import extensionAttributes from './extensionAttributes'

export default function(entities) {
  let medias = []

  entities = entities.map(cur => {
    if (
      cur.__type === 'magento__product' &&
      cur.media_gallery_entries &&
      cur.media_gallery_entries.length > 0
    ) {
      const {
        secure_base_media_url: baseURL,
        id: storeViewConfigID,
        code: storeViewConfigCode,
      } = entities.find(e => e.id === cur.storeViewConfig___NODE)

      cur.media_gallery_entries = extensionAttributes(cur.media_gallery_entries)

      cur.media_gallery_entries.forEach(e => {
        const sourceUrl = `${baseURL}catalog/product${e.file}`

        const obj = {
          ...e,
          magento_id: e.id,
          source_url: sourceUrl,
          storeViewConfig___NODE: storeViewConfigID,
          storeViewConfigCode,
          parent: null,
          children: [],
          __type: 'magento__media',
        }

        const index = medias.findIndex(
          ({ source_url: url }) => url === sourceUrl,
        )

        if (index === -1) {
          medias = [...medias, obj]
        }
      })
    }

    return cur
  })

  return [...entities, ...medias]
}

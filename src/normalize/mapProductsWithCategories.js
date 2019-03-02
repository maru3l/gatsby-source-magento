export default function(entities) {
  return entities.map(e => {
    if (e.category_links) {
      const { storeViewConfigCode } = e

      e.category_links = e.category_links.map(
        ({ category_id: id, ...link }) => {
          link.category___NODE = entities.find(
            entity =>
              Number(entity.magento_id) === Number(id) &&
              entity.storeViewConfigCode === storeViewConfigCode &&
              entity.__type === 'magento__category',
          ).id

          delete link.category_id

          return link
        },
      )
    }

    return e
  })
}

export default function(entities) {
  return entities.map(e => {
    if (e.configurable_product_links) {
      const { storeViewConfigCode } = e

      e.configurable_product___NODE = e.configurable_product_links.map(
        id =>
          entities.find(
            el =>
              Number(el.magento_id) === Number(id) &&
              el.storeViewConfigCode === storeViewConfigCode &&
              el.__type === 'magento__product',
          ).id,
      )

      delete e.configurable_product_links
    }

    return e
  })
}

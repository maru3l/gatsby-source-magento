export default function(entities) {
  return entities.map(e => {
    if (e.configurable_product_links) {
      e.configurable_product___NODE = e.configurable_product_links.map(
        id =>
          entities.find(
            el =>
              Number(el.magento_id) === Number(id) &&
              el.__type === 'magento__product',
          ).id,
      )

      delete e.configurable_product_links
    }

    return e
  })
}

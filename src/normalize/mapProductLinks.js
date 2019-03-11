export default function(entities) {
  const products = entities.filter(
    ({ __type: type }) => type === 'magento__product',
  )

  return entities.map(entity => {
    if (entity.__type === 'magento__product' && entity.product_links) {
      entity.product_links.map(link => {
        link.product___NODE = products.find(
          ({ sku, storeViewConfigCode }) =>
            storeViewConfigCode === entity.storeViewConfigCode &&
            sku === link.linked_product_sku,
        ).id

        delete link.linked_product_sku
        delete link.sku

        return link
      })
    }

    return entity
  })
}

export default function(entities) {
  const attributes = entities.filter(
    ({ __type }) => __type === 'magento__productAttributes',
  )

  const products = entities.filter(
    ({ __type }) => __type === 'magento__product',
  )
  return entities.map(entity => {
    if (
      entity.__type === 'magento__product' &&
      entity.configurable_product_options
    ) {
      const {
        storeViewConfigCode,
        configurable_product___NODE: configurableProductNode,
      } = entity

      const configurableProduct = configurableProductNode.map(id =>
        products.find(({ id: pID }) => pID === id),
      )

      entity.configurable_product_options = entity.configurable_product_options.map(
        option => {
          const {
            options: attributeOptions,
            attribute_code: attributeCode,
          } = attributes.find(
            attr =>
              attr.storeViewConfigCode === storeViewConfigCode &&
              Number(attr.magento_id) === Number(option.attribute_id),
          )

          option.values = option.values.map(({ value_index: index }) => {
            const label = attributeOptions.find(
              ({ value }) => Number(index) === Number(value),
            )

            const productsId = configurableProduct
              .filter(
                ({ [attributeCode]: code }) => Number(code) === Number(index),
              )
              .map(({ id }) => id)

            return {
              ...label,
              products___NODE: productsId,
            }
          })

          return option
        },
      )
    }

    return entity
  })
}

export default function(entities) {
  const reviews = entities.filter(
    ({ __type: type, review_entity: reviewEntity }) =>
      type === 'magento__reviews' && reviewEntity === 'product',
  )

  return entities.map(entity => {
    if (entity.__type === 'magento__product') {
      const { magento_id: productId } = entity

      entity.reviews___NODE = reviews
        .filter(
          ({ entity_pk_value: entityPkValue }) => entityPkValue === productId,
        )
        .map(({ id }) => id)
    }

    return entity
  })
}

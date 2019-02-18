export default function(entities) {
  return entities.map(e => {
    if (e.parent_id) {
      e.parent___NODE = entities.find(
        entity =>
          Number(entity.magento_id) === Number(e.parent_id) &&
          entity.__type === e.__type,
      ).id

      delete e.parent_id
    }

    return e
  })
}

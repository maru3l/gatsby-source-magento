export default function(entities) {
  return entities.map(entity => {
    if (entity.created_at) {
      entity.created_at = new Date(entity.created_at).toJSON()
    }

    if (entity.updated_at) {
      entity.updated_at = new Date(entity.updated_at).toJSON()
    }

    if (entity.special_from_date) {
      entity.special_from_date = new Date(entity.special_from_date).toJSON()
    }

    if (entity.special_to_date) {
      entity.special_to_date = new Date(entity.special_to_date).toJSON()
    }

    return entity
  })
}

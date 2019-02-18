export default function(entities) {
  return entities.map(e => {
    if (e.custom_attributes) {
      e.custom_attributes.forEach(({ attribute_code: attr, value }) => {
        e[attr] = value
      })

      delete e.custom_attributes
    }
    return e
  })
}

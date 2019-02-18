export default function(entities) {
  return entities.map(e => {
    if (e.extension_attributes) {
      Object.keys(e.extension_attributes).forEach(key => {
        e[key] = e.extension_attributes[key]
      })

      delete e.extension_attributes
    }
    return e
  })
}

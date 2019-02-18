export default function(entities) {
  return entities.map(e => {
    if (e.children) {
      e.children___NODE = e.children.map(
        childId =>
          entities.find(
            el =>
              Number(el.magento_id) === Number(childId) &&
              el.__type === e.__type,
          ).id,
      )

      delete e.children
    }

    return e
  })
}

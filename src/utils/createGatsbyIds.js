export default function(createNodeId, entities) {
  const storeViewConfig = entities.filter(
    ({ __type: type }) => type === 'magento__storeConfig',
  )
  return entities.map(e => {
    let string = ''

    if (e.storeViewConfig___NODE) {
      const { code } = storeViewConfig.find(
        ({ id }) => id === e.storeViewConfig___NODE,
      )

      string = `${e.__type}-${code}-${e.magento_id.toString()}`
    } else {
      string = `${e.__type}-${e.magento_id.toString()}`
    }
    e.id = createNodeId(string)

    return e
  })
}

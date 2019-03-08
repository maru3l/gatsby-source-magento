// vendors
import axios from 'axios'

export default async function(storeViewConfig) {
  let items = []

  try {
    const res = await axios(`/${storeViewConfig.code}/V1/directory/countries`)

    if (res.data) {
      items = res.data
    }
  } catch (error) {
    console.log(error)
  }

  return items.map(item => ({
    ...item,
    __type: 'magento__country',
    storeViewConfig___NODE: storeViewConfig.id,
    storeViewConfigCode: storeViewConfig.code,
    magento_id: item.id,
    parent: null,
    children: [],
  }))
}

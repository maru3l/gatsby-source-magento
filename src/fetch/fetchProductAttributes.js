// vendors
import axios from 'axios'

export default async function(storeViewConfig) {
  let items = []

  try {
    const res = await axios(`/${storeViewConfig.code}/V1/products/attributes`, {
      method: 'GET',
      params: {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'attribute_id',
                  value: '%',
                  condition_type: 'like',
                },
              ],
            },
          ],
        },
      },
    })

    if (res.data && res.data.items) {
      items = res.data.items
    }
  } catch (error) {
    console.log(error)
  }

  return items.map(item => ({
    ...item,
    __type: 'magento__productAttributes',
    storeViewConfig___NODE: storeViewConfig.id,
    storeViewConfigCode: storeViewConfig.code,
    magento_id: item.attribute_id,
    parent: null,
    children: [],
  }))
}

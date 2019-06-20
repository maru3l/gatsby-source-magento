// vendors
import axios from 'axios'

export default async function(storeViewConfig) {
  let items = []

  try {
    const res = await axios(`/${storeViewConfig.code}/V1/reviews`, {
      method: 'GET',
      params: {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'title',
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
    console.error(error)
  }

  return items.map(item => ({
    __type: 'magento__reviews',
    storeViewConfig___NODE: storeViewConfig.id,
    storeViewConfigCode: storeViewConfig.code,
    magento_id: item.id,
    parent: null,
    children: [],
    ...item,
  }))
}

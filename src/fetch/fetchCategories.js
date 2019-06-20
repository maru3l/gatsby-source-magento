// vendors
import axios from 'axios'

export default async function(storeViewConfig) {
  let items = []

  try {
    const res = await axios(`/${storeViewConfig.code}/V1/categories/list`, {
      method: 'GET',
      params: {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'name',
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
    ...item,
    children: item.children.split(',').filter(str => str.length),
    __type: 'magento__category',
    storeViewConfig___NODE: storeViewConfig.id,
    storeViewConfigCode: storeViewConfig.code,
    magento_id: item.id,
    parent: null,
  }))
}

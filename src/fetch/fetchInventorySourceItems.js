// vendors
import axios from 'axios'

export default async function(entities) {
  let items = []
  let item = {}
  const value = {}

  try {
    const res = await axios(`/V1/inventory/source-items`, {
      method: 'GET',
      params: {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'id',
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

  return entities.map(entity => {
    if (entity.__type === 'magento__product') {
      item = items.find(({ sku }) => sku === entity.sku)

      if (item) {
        value.qty = item.quantity

        value.inStock = item.status
      }
    }

    return { ...entity, ...value }
  })
}

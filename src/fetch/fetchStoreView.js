// vendors
import axios from 'axios'

export default async function() {
  let items = []

  try {
    const res = await axios.get(`/V1/store/storeViews`)

    if (res.data) {
      items = res.data
    }
  } catch (error) {
    console.error(error)
  }

  return items.map(item => ({
    ...item,
    __type: 'magento__storeView',
    magento_id: item.id,
    parent: null,
    children: [],
  }))
}

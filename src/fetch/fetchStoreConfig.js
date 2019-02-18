// vendors
import axios from 'axios'

export default async function() {
  let items = []

  try {
    const res = await axios.get(`/V1/store/storeConfigs`)

    if (res.data) {
      items = res.data
    }
  } catch (error) {
    console.log(error)
  }

  return items.map(item => ({
    ...item,
    __type: 'magento__storeConfig',
    magento_id: item.id,
    parent: null,
    children: [],
  }))
}

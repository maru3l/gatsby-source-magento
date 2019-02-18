// vendors
import axios from 'axios'
import crypto from 'crypto'

import fetchProduct from './fetch/fetchProducts'
import createGatsbyIds from './utils/createGatsbyIds'
import customAttributes from './normalize/customAttributes'
import extensionAttributes from './normalize/extensionAttributes'
import fetchCategories from './fetch/fetchCategories'
import mapWithChildrens from './normalize/mapWithChildrens'
import mapWithParent from './normalize/mapWithParent'
import mapProductsWithCategories from './normalize/mapProductsWithCategories'
import mapProductWithConfigurableProducts from './normalize/mapProductWithConfigurableProducts'
import createMediaNode from './normalize/createMediaNode'
import fetchStoreConfig from './fetch/fetchStoreConfig'
import downloadMedias from './normalize/downloadMedias'

exports.sourceNodes = async (
  { actions, store, cache, createNodeId },
  configOptions,
) => {
  const { createNode } = actions
  const {
    baseUrl,
    protocol,
    login: { username, password },
  } = configOptions
  axios.defaults.baseURL = `${protocol}://${baseUrl}/rest`

  // Get token for connexion
  try {
    const { data: token } = await axios.post(`/V1/integration/admin/token`, {
      username,
      password,
    })

    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  } catch (error) {
    console.log(error)
  }

  let storeConfigs = await fetchStoreConfig()
  storeConfigs = createGatsbyIds(createNodeId, storeConfigs)

  let entities = await Promise.all(
    storeConfigs.reduce(
      (acc, storeViewConfig) => [
        ...acc,
        fetchProduct(storeViewConfig),
        fetchCategories(storeViewConfig),
      ],
      [],
    ),
  ).then(res => [].concat(...res))

  entities = [...entities, ...storeConfigs]
  entities = createGatsbyIds(createNodeId, entities)
  entities = customAttributes(entities)
  entities = extensionAttributes(entities)
  entities = mapWithParent(entities)
  entities = mapWithChildrens(entities)
  entities = mapProductsWithCategories(entities)
  entities = mapProductWithConfigurableProducts(entities)
  entities = createMediaNode(createNodeId, entities)
  entities = await downloadMedias(
    entities,
    store,
    cache,
    createNode,
    createNodeId,
  )

  entities.forEach(e => {
    createNode({
      ...e,
      internal: {
        type: e.__type,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(e))
          .digest(`hex`),
      },
    })
  })
}

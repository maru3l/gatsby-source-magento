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
import standardizeDates from './normalize/standardizeDates'
import fetchProductAttributes from './fetch/fetchProductAttributes'
import mapProductConfigurationOptions from './normalize/mapProductConfigurationOptions'
import mapProductMediaWithMedia from './normalize/mapProductMediaWithMedia'
import fetchCountries from './fetch/fetchCountries'

exports.sourceNodes = async (
  { actions, store, cache, createNodeId, touchNode },
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
        fetchProductAttributes(storeViewConfig),
        fetchCountries(storeViewConfig),
      ],
      [],
    ),
  ).then(res => [].concat(...res))
  entities = [...entities, ...storeConfigs]
  entities = createMediaNode(entities)

  entities = createGatsbyIds(createNodeId, entities)
  entities = customAttributes(entities)
  entities = extensionAttributes(entities)
  entities = mapWithParent(entities)
  entities = mapWithChildrens(entities)
  entities = mapProductsWithCategories(entities)
  entities = mapProductWithConfigurableProducts(entities)
  entities = mapProductConfigurationOptions(entities)
  entities = mapProductMediaWithMedia(entities)

  entities = await downloadMedias(
    entities,
    store,
    cache,
    createNode,
    createNodeId,
    touchNode,
  )

  entities = standardizeDates(entities)

  entities.forEach(e => {
    if (e.storeViewConfigCode) {
      delete e.storeViewConfigCode
    }

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

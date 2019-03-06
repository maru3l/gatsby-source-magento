const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

export default async (
  nodes,
  store,
  cache,
  createNode,
  createNodeId,
  touchNode,
) =>
  Promise.all(
    nodes.map(async node => {
      let fileNodeID
      if (node.__type === `magento__media`) {
        const mediaDataCacheKey = `magento-media-${node.magento_id}`
        const cacheMediaData = await cache.get(mediaDataCacheKey)

        // If we have cached media data and it wasn't modified, reuse
        // previously created file node to not try to redownload
        if (cacheMediaData) {
          fileNodeID = cacheMediaData.fileNodeID
          touchNode({ nodeId: cacheMediaData.fileNodeID })
        }

        // If we don't have cached data, download the file
        if (!fileNodeID) {
          try {
            const fileNode = await createRemoteFileNode({
              url: node.source_url,
              store,
              cache,
              createNode,
              createNodeId,
              parentNodeId: node.id,
            })

            if (fileNode) {
              fileNodeID = fileNode.id

              await cache.set(mediaDataCacheKey, {
                fileNodeID,
              })
            }
          } catch (e) {
            console.error(e)
          }
        }
      }

      if (fileNodeID) {
        node.localFile___NODE = fileNodeID

        delete node.file
      }

      return node
    }),
  )

const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

export default async (nodes, store, cache, createNode, createNodeId) =>
  Promise.all(
    nodes.map(async node => {
      if (node.__type === 'magento__media') {
        let fileNode

        try {
          fileNode = await createRemoteFileNode({
            url: node.source_url,
            store,
            cache,
            createNode,
            createNodeId,
          })
        } catch (error) {
          console.log(error)
        }

        if (fileNode) {
          node.localFile___NODE = fileNode.id
        }
      }

      return node
    }),
  )

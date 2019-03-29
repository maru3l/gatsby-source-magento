# gatsby-source-magento

Source plugin for pulling data into [Gatsby](https://github.com/gatsbyjs) from
Magento2 sites using the
[Magento2 REST API](https://devdocs.magento.com/guides/v2.3/rest/bk-rest.html).

## Features

- Pulls data from Magento2 sites

  - Store Configuration
  - Categories
  - Products
  - Images from Products
  - Countries
  - Product attributes
  - Review if the modules [divante/magento2-review-api](https://github.com/DivanteLtd/magento2-review-api) is installed

- Link products with Store Configuration
- Link categories with Store Configuration
- Link categories with products
- Link images with products
- Link review with product
- Link products with configurable product

## Install

`npm install --save gatsby-source-magento`

## How to use

First, you need a way to pass environment variables to the build process, so secrets and other secured data aren't committed to source control. We recommend using [`dotenv`](https://www.npmjs.com/package/dotenv) which will then expose environment variables. [Read more about dotenv and using environment variables here](https://www.gatsbyjs.org/docs/environment-variables/). Then we can _use_ these environment variables and configure our plugin.

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    /*
     * Gatsby's data processing layer begins with “source”
     * plugins. Here the site sources its data from magento.
     */
    {
      resolve: 'gatsby-source-magento',
      options: {
        /*
         * The base URL of the Magento2 site without the trailingslash and the protocol. This is required.
         * Example : 'www.example-site.com'
         */
        baseUrl: 'www.example-site.com',
        // The protocol. This can be http or https.
        protocol: 'http',
        login: {
          username: 'admin',
          password: 'password',
        },
      },
    },
  ],
}
```

## Test your Magento2 API

Before you run your first query, ensure the Magento2 JSON API is working correctly by visiting /rest/V1 at your Magento install.

## How to query

You can query nodes created from Magento using GraphQL like the following:
Note : Learn to use the GraphQL tool and Ctrl+Spacebar at
<http://localhost:3000/___graphiql> to discover the types and properties of your
GraphQL model.

### Query Products

```graphql
{
  allMagentoProduct {
    edges {
      node {
        id
        sku
        name
        description
        # ...
      }
    }
  }
}
```

### Query Categories

```graphql
{
  allMagentoCategory {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

### Query Store configurations

```graphql
{
  allMagentoStoreConfig {
    edges {
      node {
        id
        code
        website_id
        locale
        base_currency_code
      }
    }
  }
}
```

## Image processing

To use image processing you need `gatsby-transformer-sharp`, `gatsby-plugin-sharp` and their
dependencies `gatsby-image` and `gatsby-source-filesystem` in your `gatsby-config.js`.

You can apply image processing to:

- Product media_gallery_entries
- Product image
- Product small_image
- Product thumbnail

To access image processing in your queries you need to use this pattern:

```
{
  imageFieldName {
    localFile {
      childImageSharp {
        ...ImageFragment
      }
    }
  }
}
```

Full example:

```graphql
{
  allMagentoProducts {
    edges {
      node {
        image {
          localFile {
            childImageSharp {
              fixed(width: 500, height: 300) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
        }
        media_gallery_entries {
          file {
            localFile {
              childImageSharp {
                fluid(maxWidth: 500) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
      small_image {
        localFile {
          childImageSharp {
            fixed(width: 500, height: 300) {
              ...GatsbyImageSharpFixed_withWebp
            }
          }
        }
      }
      thumbnail {
        localFile {
          childImageSharp {
            fixed(width: 500, height: 300) {
              ...GatsbyImageSharpFixed_withWebp
            }
          }
        }
      }
    }
  }
}
```

To learn more about image processing check

- documentation of [gatsby-plugin-sharp](/packages/gatsby-plugin-sharp/),
- source code of [image processing example
  site](https://github.com/gatsbyjs/gatsby/tree/master/examples/image-processing).

<!-- ## Site's `gatsby-node.js` example

```javascript
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const slash = require(`slash`)

// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
// Will create pages for WordPress pages (route : /{slug})
// Will create pages for WordPress posts (route : /post/{slug})
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    // The “graphql” function allows us to run arbitrary
    // queries against the local WordPress graphql schema. Think of
    // it like the site has a built-in database constructed
    // from the fetched data that you can run queries against.

    // ==== PAGES (WORDPRESS NATIVE) ====
    graphql(
      `
        {
          allWordpressPage {
            edges {
              node {
                id
                slug
                status
                template
              }
            }
          }
        }
      `
    )
      .then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create Page pages.
        const pageTemplate = path.resolve("./src/templates/page.js")
        // We want to create a detailed page for each
        // page node. We'll just use the WordPress Slug for the slug.
        // The Page ID is prefixed with 'PAGE_'
        _.each(result.data.allWordpressPage.edges, edge => {
          // Gatsby uses Redux to manage its internal state.
          // Plugins and sites can use functions like "createPage"
          // to interact with Gatsby.
          createPage({
            // Each page is required to have a `path` as well
            // as a template component. The `context` is
            // optional but is often necessary so the template
            // can query data specific to each page.
            path: `/${edge.node.slug}/`,
            component: slash(pageTemplate),
            context: {
              id: edge.node.id,
            },
          })
        })
      })
      // ==== END PAGES ====

      // ==== POSTS (WORDPRESS NATIVE AND ACF) ====
      .then(() => {
        graphql(
          `
            {
              allWordpressPost {
                edges {
                  node {
                    id
                    slug
                    status
                    template
                    format
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const postTemplate = path.resolve("./src/templates/post.js")
          // We want to create a detailed page for each
          // post node. We'll just use the WordPress Slug for the slug.
          // The Post ID is prefixed with 'POST_'
          _.each(result.data.allWordpressPost.edges, edge => {
            createPage({
              path: `/${edge.node.slug}/`,
              component: slash(postTemplate),
              context: {
                id: edge.node.id,
              },
            })
          })
          resolve()
        })
      })
    // ==== END POSTS ====
  })
}
``` -->

<!-- ## Troubleshooting -->

## Todo

[] add Verbos mode

[] add log

[] add `Site's`gatsby-node.js`example` in README file

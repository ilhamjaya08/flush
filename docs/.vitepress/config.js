import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Flush Framework',
  description: 'A fast, clean MVC framework for Bun runtime',
  base: '/',
  cleanUrls: true,
  
  head: [
    ['link', { rel: 'icon', href: '/flush-icon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Flush Framework' }],
    ['meta', { property: 'og:description', content: 'A fast, clean MVC framework for Bun runtime' }],
    ['meta', { property: 'og:image', content: '/flush-logo.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Flush Framework' }],
    ['meta', { name: 'twitter:description', content: 'A fast, clean MVC framework for Bun runtime' }],
    ['meta', { name: 'twitter:image', content: '/flush-logo.png' }]
  ],

  themeConfig: {
    logo: '/flush-icon.png',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/app' },
      { text: 'Examples', link: '/examples/basic-app' },
      { 
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Flush?', link: '/guide/what-is-flush' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'Essentials',
          items: [
            { text: 'Project Structure', link: '/guide/project-structure' },
            { text: 'Routing', link: '/guide/routing' },
            { text: 'Controllers', link: '/guide/controllers' },
            { text: 'Models', link: '/guide/models' },
            { text: 'Middleware', link: '/guide/middleware' },
            { text: 'Validation', link: '/guide/validation' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'CLI Commands', link: '/guide/cli' },
            { text: 'Database', link: '/guide/database' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Deployment', link: '/guide/deployment' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'Core API',
          items: [
            { text: 'FlushApp', link: '/api/app' },
            { text: 'Request', link: '/api/request' },
            { text: 'Response', link: '/api/response' },
            { text: 'Router', link: '/api/router' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'Controller', link: '/api/controller' },
            { text: 'Model', link: '/api/model' },
            { text: 'Middleware', link: '/api/middleware' },
            { text: 'Validator', link: '/api/validator' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Application', link: '/examples/basic-app' },
            { text: 'REST API', link: '/examples/rest-api' },
            { text: 'Authentication', link: '/examples/authentication' },
            { text: 'File Upload', link: '/examples/file-upload' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ilhamjaya08/flush-framework' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/flush-core' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Flush Framework'
    },

    editLink: {
      pattern: 'https://github.com/ilhamjaya08/flush-framework/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    }
  }
})
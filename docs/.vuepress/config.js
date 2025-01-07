import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  base: '/tardis/',

  lang: 'zh-CN',

  title: 'TARDIS',
  // description: '基于大方向功利主义的知识库',

  theme: defaultTheme({
    // logo: 'https://vuejs.press/images/hero.png',

    navbar: [
      '/',
      {
        text: '学习',
        children: [
          { text: '系统架构设计师', link: '/posts/system-architecture-designer/' },
        ],
      },
    ],

    sidebar: {
      '/posts/system-architecture-designer/': {
        text: '系统架构设计师',
        children: [
          'architecture-designer',
          'how-to-become-an-architecture-designer',
        ],
      },
    },
  }),

  plugins: [
    blogPlugin({
      // Only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      // Getting article info
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt:
          // Support manually set excerpt through frontmatter
          typeof frontmatter.excerpt === 'string'
            ? frontmatter.excerpt
            : data?.excerpt || '',
      }),

      // Generate excerpt for all pages excerpt those users choose to disable
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== 'string',

      category: [
      ],

      type: [
      ],

      hotReload: true,
    }),
  ],

  bundler: viteBundler(),
})

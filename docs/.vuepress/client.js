import { defineClientConfig } from 'vuepress/client'
import KnowledgeGraphAsync from './components/KnowledgeGraphAsync.vue'

export default defineClientConfig({
  // we provide some blog layouts
  layouts: {
  },

  enhance({ app }) {
    app.component('KnowledgeGraphAsync', KnowledgeGraphAsync)
  },
})

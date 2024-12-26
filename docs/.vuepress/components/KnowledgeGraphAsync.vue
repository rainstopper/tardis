<!--
异步加载的知识图谱组件
封装了知识图谱组件
-->

<script setup>
import { onMounted, ref } from 'vue'
import { withBase } from 'vuepress/client'
import KnowledgeGraph from './KnowledgeGraph.vue'
import http from '../http'

const props = defineProps({
  ...KnowledgeGraph.props,

  /**
   * 加载数据的 url
   * @param {String}
   */
  url: [String, Array],
})

const nodes = ref([])

const edges = ref([])

const loading = ref(false)

onMounted(() => {
  if (!props.url) {
    return
  }
  const urls = Array.isArray(props.url) ? props.url : [props.url]
  // 加载知识图谱所需的数据
  loading.value = true
  Promise.all(urls.map(item => http.get(withBase(item)))).then(res => {
    nodes.value = res.reduce((arr, item) => [...arr, ...(item.nodes || [])], [])
    edges.value = res.reduce((arr, item) => [...arr, ...(item.edges || [])], [])
  }).finally(() => {
    loading.value = false
  })
})
</script>

<template lang="html">
  <KnowledgeGraph
    :width="width"
    :height="height"
    :title="title"
    :nodes="nodes"
    :edges="edges"
    :loading="loading"
    :legends="legends"
    :force="force"
    :sort-legends="sortLegends"
    :color="color"
  />
</template>

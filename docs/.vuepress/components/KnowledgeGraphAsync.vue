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
  url: String,
})

const nodes = ref([])

const edges = ref([])

const loading = ref(false)

onMounted(() => {
  // 加载知识图谱所需的数据
  loading.value = true
  http.get(withBase(props.url)).then((res) => {
    nodes.value = res.nodes || []
    edges.value = res.edges || []
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

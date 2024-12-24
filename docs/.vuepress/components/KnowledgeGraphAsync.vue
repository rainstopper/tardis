/**
 * 异步加载的知识图谱组件
 * 封装了知识图谱组件
 * 默认加载 /data/knowledge 下与 this.$route.path 对应目录下的 nodes.json 和 edges.json 资源
 */

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

<script>
import KnowledgeGraph from './KnowledgeGraph.vue'
import http from '../http'

export default {
  components: { KnowledgeGraph },

  props: {
    /**
     * 宽度
     * 透传给知识图谱组件
     * @param {String}
     */
    width: String,

    /**
     * 高度
     * 透传给知识图谱组件
     * @param {String}
     */
    height: String,

    /**
     * 标题
     * 透传给知识图谱组件
     * @param {String}
     */
    title: String,

    /**
     * 自定义图例
     * 透传给知识图谱组件
     * @param {Array}
     */
    legends: Array,

    /**
     * 加载数据的 url
     * @param {String}
     */
    url: String,

    /**
     * 力引导布局相关的配置项
     * 透传给知识图谱组件
     * @param {Object}
     */
    force: Object,

    /**
     * 图例是否按名称首字母重排序
     * 透传给知识图谱组件
     * @param {Boolean}
     */
    sortLegends: Boolean,

    /**
     * 图例颜色
     * @param {Array}
     */
    color: Array
  },

  data () {
    return {
      /**
       * 存放节点数据
       * @param {Array}
       */
      nodes: [],

      /**
       * 存放边数据
       * @param {Array}
       */
      edges: [],

      /**
       * 加载状态
       * @param {Boolean}
       */
      loading: false
    }
  },

  mounted () {
    // 加载知识图谱所需的数据
    // 默认节点数据和边数据来自于两个不同的 api，需要分两次请求
    this.loading = true
    http.get(this.$withBase(this.url)).then((res) => {
      this.nodes = res.nodes || []
      this.edges = res.edges || []
    }).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="css" scoped>
</style>

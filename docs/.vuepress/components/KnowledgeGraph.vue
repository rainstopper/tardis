<!-- 知识图谱 -->

<template lang="html">
  <div class="knowledge-graph" :style="`width: ${width}; height: ${height};`">
    <!-- 支持 Vue 响应式的 ECharts 组件 -->
    <ResponsiveEcharts
      :option="option"
      :loading="loading"
      @click="onClick"
    />

    <!-- 搜索工具栏 -->
    <div class="search-tool">
      <!-- 关键字 -->
      <div class="item">
        <label>关键字</label>
        <div class="content">
          <div class="input" ref="select">
            <input
              type="text"
              :value="search.keyword"
              @input="handleKeywordInput"
              @focus="search.showOptions = true"
              @blur="handleKeywordBlur"
            />
            <!-- 选项 -->
            <ul v-show="search.showOptions" class="options">
              <li
                v-show="keywords.length"
                v-for="item in keywords"
                class="option"
                @click.stop="search.keyword = item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResponsiveEcharts from './ResponsiveEcharts.vue'
// 按需引入 ECharts 组件
import 'echarts/lib/chart/graph'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'
import { commonUtil } from '../utils'

/**
 * 高亮颜色
 */
const ACTIVE_COLOR = '#3eaf7c'

const DEFAULT_FORCE = {
  edgeLength: 50,
  repulsion: 50,
  gravity: 0.05
}

export default {
  components: { ResponsiveEcharts },

  props: {
    /**
     * 宽度，默认 100%
     * @param {String}
     */
    width: {
      type: String,
      default: '100%',
    },

    /**
     * 高度，默认 100%
     * @param {String}
     */
    height: {
      type: String,
      default: '100%',
    },

    /**
     * 标题
     * @param {String}
     */
    title: String,

    /**
     * 节点
     * 数据格式：
     * {
     *   name: String,
     *   category: String,
     *   link: String
     * }
     * @param {Array}
     */
    nodes: {
      type: Array,
      default: () => [],
    },

    /**
     * 边
     * @param {Array}
     */
    edges: {
      type: Array,
      default: () => [],
    },

    /**
     * 加载状态
     * 透传给响应式的 ECharts 组件
     * @param {Boolean}
     */
    loading: Boolean,

    /**
     * 自定义图例
     * 若不传，默认根据节点的 category 分类设置图例
     * @param {Array}
     */
    legends: Array,

    /**
     * 图例是否按名称首字母重排序
     * @param {Boolean}
     */
    sortLegends: {
      type: Boolean,
      default: false,
    },

    /**
     * 其他分类，无分类项目的默认分类
     * @param {Object}
     */
    categoryOther: {
      type: String,
      default: '其他',
    },

    /**
     * 节点大小下限
     * 用于计算节点大小
     * @param {Number}
     */
    minNodeSize: {
      type: Number,
      default: 10,
    },

    /**
     * 节点大小上限
     * 用于计算节点大小
     * @param {Number}
     */
    maxNodeSize: {
      type: Number,
      default: 50,
    },

    /**
     * 节点大小步长
     * 用于计算节点大小
     * @param {Number}
     */
    nodeSizeStep: {
      type: Number,
      default: 0.5,
    },

    /**
     * 透明度下限
     * 用于计算节点透明度
     * @param {Number}
     */
    minNodeOpacity: {
      type: Number,
      default: 0.5,
    },

    /**
     * 透明度上限
     * 用于计算节点透明度
     * @param {Number}
     */
    maxNodeOpacity: {
      type: Number,
      default: 1,
    },

    /**
     * 透明度上限度数
     * 大于等于该值能达到透明度上限
     * @param {Object}
     */
    maxNodeOpacityDegree: {
      type: Number,
      default: 10,
    },

    /**
     * 透明度指数
     * 该值越大，不同度数的节点的透明度差异越大
     * @param {Number}
     */
    nodeOpacityIndex: {
      type: Number,
      default: 1,
    },

    /**
     * 节点的度数大于等于这个数值才展示
     * @param {Number}
     */
    nodeVisibleDegree: {
      type: Number,
      default: 1,
    },

    /**
     * 节点的度数大于等于这个数值才展示标签
     * @param {Number}
     */
    nodeLabelVisibleDegree: {
      type: Number,
      default: 1,
    },

    /**
     * 颜色
     * @param {Array}
     */
    color: {
      type: Array,
      default: () => [
        // 蓝
        '#338fcc',
        // 青
        '#2bb3d5',
        // 绿
        '#33ccae',
        // 黄
        '#fedca9',
        // 橘
        '#fab36f',
        // 红
        '#d96d6f',
        // 粉
        '#ff88b8',
        // 紫
        '#a869a8',
      ],
    },

    /**
     * 链接边颜色，默认使用主题高亮颜色
     * 用于指定边的样式
     * @param {Object}
     */
    linkEdgeColor: {
      type: String,
      default: ACTIVE_COLOR,
    },

    /**
     * 力引导布局相关的配置项
     * 当节点数量很大时，用户可以用此配置项自行调整布局，使图形更美观
     * 会合并默认配置项
     * @param {Object}
     */
    force: {
      type: Object,
      default: () => ({}),
    },

    /**
     * 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点，默认 false
     * @param {Boolean}
     */
    focusNodeAdjacency: {
      type: Boolean,
      default: false,
    }
  },

  data () {
    return {
      /**
       * 搜索工具
       * @param {Object}
       */
      search: {
        /**
         * 关键字
         * @param {String}
         */
        keyword: '',

        /**
         * 是否展示选项
         * @param {Boolean}
         */
        showOptions: false,

        /**
         * 防抖计时器
         * @param {Object}
         */
        timer: null
      }
    }
  },

  computed: {
    /**
     * ECharts option
     * @return {Object} option
     */
    option () {
      const { title, _legends, force, focusNodeAdjacency, categories, _nodes, _edges } = this
      return {
        title: { // 标题
          text: title,
          top: 8,
          left: 8
        },
        legend: { // 图例
          type: 'scroll',
          top: commonUtil.isNotEmpty(title) && 36 || 0,
          left: 8,
          orient: 'vertical',
          data: _legends
        },
        tooltip: { // 提示框
          // position: ['100%', 0],
          /**
           * 格式化提示框内容
           * @param  {String} dataType  数据类型，'node' 表示节点，'edge' 表示边
           * @param  {Object} [data={}] 数据
           * @return {String}           提示框内容
           */
          formatter ({ dataType, data = {} } = {}) {
            const { name, source, value, target, description, link } = data
            let str = {
              node: `${name}（关联 ${value} 个节点）`, // 节点提示框内容
              edge: `${source} ${value} ${target}` // 边提示框内容
            }[dataType] || ''
            if (description) str += `${str.length && '<br/>' || ''}${description.replace(/\n/g, '<br/>')}` // 附带描述的项目追加描述
            if (link) str += `${str.length && '<br/>' || ''}点击查看详情` // 附带链接的项目追加“点击查看详情”
            return str
          }
        },
        series: [{
          type: 'graph',
          layout: 'force',
          force: Object.assign({}, DEFAULT_FORCE, force), // 力引导布局相关的配置项
          roam: true, // 是否开启鼠标缩放和平移漫游
          draggable: true, // 节点是否可拖拽，只在使用力引导布局的时候有用
          focusNodeAdjacency, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点
          itemStyle: { // 图形样式
            borderColor: '#fff', // 图形的描边颜色
            borderWidth: 1, // 描边线宽
            shadowBlur: 10, // 图形阴影的模糊大小
            shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          },
          label: { // 图形上的文本标签
            position: 'right', // 标签的位置
            distance: 3, // 距离图形元素的距离
            formatter: '{b}'
          },
          edgeLabel: { // 关系边上的文本标签
            formatter: '{c}'
          },
          emphasis: { // 高亮的图形样式
            lineStyle: {
              width: 4 // 线宽
            }
          },
          categories: categories,
          nodes: _nodes,
          edges: _edges
        }],
        color: this.color
      }
    },

    /**
     * ECharts 图例
     * 取 nodes 中非空的 category 属性，并去重
     * 末尾补充“其他”分类，用于对没有设置分类的项目归类
     * @return {Array} 图例
     */
    _legends () {
      const { nodes, legends, categoryOther, sortLegends } = this
      if (!nodes || !nodes.length) return [] // 节点为空时返回空
      let __legends
      if (legends) { // 优先使用传入的自定义图例属性 legends
        __legends = legends
      } else { // 未传入属性 legends 时，默认按节点的 category 分类自动生成图例
        __legends = [
          ...new Set( // 利用 Set 去重
            nodes.map(({ category }) => category).filter(item => commonUtil.isNotEmpty(item) && item !== categoryOther) // 不为空，且不是“其他”
          )
        ]
        if (sortLegends) __legends.sort((a, b) => a.localeCompare(b)) // 按名称首字母排序
      }
      return [
        ...__legends,
        categoryOther // 在末尾补充“其他”分类
      ]
    },

    /**
     * ECharts 关系图的分类
     * 将 nodes 中的 category 去重
     * @return {Array} 分类
     */
    categories () {
      return this._legends.map(category => ({ name: category }))
    },

    /**
     * ECharts 关系图的 nodes
     * 对 name（名称）属性重复的节点去重
     * 重新组织成 ECharts 关系图接受的数据格式
     * 按照度数过滤
     * 支持按关键字搜索，触发搜索时，搜索结果中的节点会被高亮展示，其余节点透明化处理
     * @return {Array} nodes
     */
    _nodes () {
      const { nodes, edges, _legends, search = {}, maxNodeOpacity, minNodeOpacity, getNodeSize, getNodeOpacity, nodeLabelVisibleDegree, nodeVisibleDegree } = this
      const uniqueNameMap = new Map() // 用于 name 属性去重的 Map
      return nodes.filter(({ name }) => !uniqueNameMap.has(name) && uniqueNameMap.set(name, 1)).map((item = {}) => { // 组织数据结构
        const degree = Math.max( // 节点度数
          edges.reduce((sum, { source, target }) => (item.name === source || item.name === target) && sum + 1 || sum, 0), // 每条相邻边使节点的度数加 1
          1 // 不小于 1
        )
        const categoryIndex = _legends.findIndex(category => category === item.category)
        const { keyword } = search // 获取搜索关键字
        let itemStyle, label = {}
        if (commonUtil.isNotEmpty(keyword)) { // 关键字不为空时触发搜索
          if (item.name.includes(keyword)) { // 该节点在搜索结果中
            itemStyle = {
              color: ACTIVE_COLOR, // 节点颜色高亮
              shadowColor: ACTIVE_COLOR, // 阴影颜色高亮
              opacity: maxNodeOpacity // 节点透明度值最大
            }
            label = { color: ACTIVE_COLOR } // 节点标签颜色高亮
          } else { // 该节点未在搜索结果中
            itemStyle = {
              opacity: minNodeOpacity
            }
          }
        } else { // 未触发搜索
          itemStyle = { opacity: getNodeOpacity(degree) }
        }
        return {
          ...item,
          value: degree,
          category: categoryIndex >= 0 ? categoryIndex : _legends.length - 1, // 节点分类，默认最后一个，对应“其他”分类
          symbolSize: getNodeSize(degree), // 节点大小
          itemStyle, // 图形样式
          label: { // 标签
            ...label,
            show: degree >= nodeLabelVisibleDegree // 度数足够大时展示
          }
        }
      }).filter(({ value }) => value >= nodeVisibleDegree)
    },

    /**
     * ECharts 关系图的 edges
     * 带有链接的边高亮显示
     * @return {Array} edges
     */
    _edges () {
      const { edges, linkEdgeColor } = this
      return edges.map(item => ({
        ...item,
        value: item.predicate || '-',
        lineStyle: { // 关系边的线条样式
          color: item.link && linkEdgeColor // 线的颜色
        }
      }))
    },

    /**
     * 包含关键字所得的选项列表
     * @return {Array} 选项列表
     */
    keywords () {
      const { nodes, search = {} } = this
      const { keyword } = search
      if (commonUtil.isEmpty(keyword)) return []
      return nodes.map(({ name }) => name).filter(item => item.includes(keyword))
    }
  },

  methods: {
    /**
     * 获取节点大小
     * @param  {Number} degree 节点度数
     * @return {Number}        节点大小
     */
    getNodeSize (degree) {
      const { minNodeSize, maxNodeSize, nodeSizeStep } = this
      return Math.min(minNodeSize + (degree - 1) * nodeSizeStep, maxNodeSize)
    },

    /**
     * 获取节点透明度
     * @param  {Number} degree 节点度数
     * @return {Number}        节点透明度
     */
    getNodeOpacity (degree) {
      const { minNodeOpacity, maxNodeOpacity, maxNodeOpacityDegree, nodeOpacityIndex } = this
      return Math.min(minNodeOpacity + Math.pow(degree / maxNodeOpacityDegree, nodeOpacityIndex) * (1 - minNodeOpacity), maxNodeOpacity)
    },

    /**
     * 点击操作
     * 如果项目附带链接，跳转至相应的地址
     * @param  {Object} [data={}] 点击事件
     */
    onClick ({ data = {} } = {}) {
      const { link } = data
      if (link) this.$router.push(link)
      // link && window.open(this.$withBase(link), '\_blank')
    },

    /**
     * 实现关键字的反向数据流，这里用到了防抖，延时 300ms
     * @param  {Object} e  事件
     */
    handleKeywordInput (e) {
      if (this.search.timer) clearTimeout(this.search.timer) // 重新计时
      this.search.timer = setTimeout(() => {
        this.search.keyword = e.target.value
      }, 300)
    },

    /**
     * 关键字输入框 blur 事件触发隐藏关键字选项下拉框
     * 此事件的触发先于选项的 click 事件，隐藏下拉列表后，会阻碍选项的选中
     * 这里需要等待选项的 click 事件完成后，再隐藏
     */
    handleKeywordBlur () {
      setTimeout(() => {
        this.search.showOptions = false
      }, 100)
    }
  }
}
</script>

<style lang="stylus" scoped>
BORDER_RADIUS = 3px
BORDER_COLOR = #cfd4db
BORDER_COLOR_LIGHT = #eee
LABEL_WIDTH = 60px

.knowledge-graph
  position relative
  margin 20px auto
  border 1px solid BORDER_COLOR_LIGHT

  /**
   * 搜索工具样式
   */
  .search-tool
    position absolute
    top 0
    right 0
    padding 5px
    background-color rgba(255, 255, 255, 0.6)

    // .search-tool .item
    .item
      padding 5px
      font-size 14px

      // .search-tool .item label
      label
        width LABEL_WIDTH
        height 100%
        text-align right
        vertical-align middle
        float left
        padding 0 12px 0 0
        box-sizing border-box
        line-height 22px

      // .search-tool .item .content
      .content
        position relative
        margin-left LABEL_WIDTH

        // .search-tool .item .content .input
        .input
          // .search-tool .item .content .input input
          input
            width 10rem
            border 1px solid BORDER_COLOR
            border-radius BORDER_RADIUS
            padding 2px 1.2rem 2px 5px
            outline none
            background #fff url("~@vuepress/plugin-search/search.svg") 8.9rem 0.2rem no-repeat // 使用默认主题的搜索 svg 图标
            box-sizing border-box
            font-size 14px

            // .search-tool .item .content .input input:focus
            &:focus
              border-color #3eaf7c

          // .search-tool .item .content .input .options
          .options
            position absolute
            top 10px
            left 0
            max-height 200px
            overflow-y auto
            border 1px solid BORDER_COLOR
            border-radius BORDER_RADIUS
            padding 0
            list-style none
            background-color #fff

            // .search-tool .item .content .input .options .option
            .option
              min-width 9.9rem
              border-bottom 1px solid BORDER_COLOR_LIGHT
              padding 3px 6px
              box-sizing border-box
              line-height 20px
              font-size 14px
              cursor pointer

              // .search-tool .item .content .input .options .option:last-of-type
              &:last-of-type
                border 0

              // .search-tool .item .content .input .options .option:hover
              &:hover
                background-color: #f3f5f7
</style>

<!-- 知识图谱 -->

<script setup>
import { computed, reactive } from 'vue'
import { withBase } from 'vuepress/client'
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

const props = defineProps({
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
      // 橄榄
      '#a7c728',
      // 黄
      '#fedca9',
      // 橘
      '#fab36f',
      // 棕
      '#bb7444',
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
  },
})

/**
 * 搜索工具
 * @param {Object}
 */
const search = reactive({
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
  timer: null,
})

/**
 * ECharts 图例
 * 取 nodes 中非空的 category 属性，并去重
 * 末尾补充“其他”分类，用于对没有设置分类的项目归类
 * @return {Array} 图例
 */
const legends = computed(() => {
  if (!props.nodes?.length) {
    return []
  }
  let data
  if (props.legends) {
    // 优先使用传入的自定义图例属性 legends
    data = props.legends
  } else {
    // 未传入属性 legends 时，默认按节点的 category 分类自动生成图例
    data = [
      // 去重
      ...new Set(
        props.nodes
          .map(item => item.category)
          // 不为空，且不是“其他”
          .filter(item => commonUtil.isNotEmpty(item) && item !== props.categoryOther)
      )
    ]
    if (props.sortLegends) {
      // 按名称首字母排序
      data.sort((a, b) => a.localeCompare(b))
    }
  }
  return [
    ...data,
    // 在末尾补充“其他”分类
    props.categoryOther,
  ]
})

/**
 * ECharts 关系图的分类
 * 将 nodes 中的 category 去重
 * @return {Array} 分类
 */
const categories = computed(() => legends.value.map(item => ({ name: item })))

/**
 * 获取节点大小
 * @param  {Number} degree 节点度数
 * @return {Number}        节点大小
 */
function getNodeSize(degree) {
  return Math.min(props.minNodeSize + (degree - 1) * props.nodeSizeStep, props.maxNodeSize)
}

/**
 * 获取节点透明度
 * @param  {Number} degree 节点度数
 * @return {Number}        节点透明度
 */
function getNodeOpacity(degree) {
  return Math.min(
    props.minNodeOpacity + Math.pow(degree / props.maxNodeOpacityDegree, props.nodeOpacityIndex) * (1 - props.minNodeOpacity),
    props.maxNodeOpacity,
  )
}

/**
 * ECharts 关系图的 nodes
 * 对 name（名称）属性重复的节点去重
 * 重新组织成 ECharts 关系图接受的数据格式
 * 按照度数过滤
 * 支持按关键字搜索，触发搜索时，搜索结果中的节点会被高亮展示，其余节点透明化处理
 * @return {Array} nodes
 */
const nodes = computed(() => {
  // 用于 name 属性去重的 Map
  const uniqueNameMap = new Map()
  // 组织数据结构
  return props.nodes.filter(({ name }) => !uniqueNameMap.has(name) && uniqueNameMap.set(name, 1)).map((item = {}) => {
    // 节点度数
    const degree = Math.max(
      // 每条相邻边使节点的度数加 1
      props.edges.reduce((sum, { source, target }) => (item.name === source || item.name === target) && sum + 1 || sum, 0),
      // 不小于 1
      1,
    )
    const categoryIndex = legends.value.findIndex(category => category === item.category)
    // 获取搜索关键字
    const { keyword } = search
    let itemStyle, label = {}
    if (commonUtil.isNotEmpty(keyword)) {
      // 关键字不为空时触发搜索
      if (item.name.includes(keyword)) {
        // 该节点在搜索结果中
        itemStyle = {
          // 节点颜色高亮
          color: ACTIVE_COLOR,
          // 阴影颜色高亮
          shadowColor: ACTIVE_COLOR,
          // 节点透明度值最大
          opacity: props.maxNodeOpacity,
        }
        // 节点标签颜色高亮
        label = { color: ACTIVE_COLOR }
      } else {
        // 该节点未在搜索结果中
        itemStyle = {
          opacity: props.minNodeOpacity,
        }
      }
    } else {
      // 未触发搜索
      itemStyle = { opacity: getNodeOpacity(degree) }
    }
    return {
      ...item,
      value: degree,
      // 节点分类，默认最后一个，对应“其他”分类
      category: categoryIndex >= 0 ? categoryIndex : legends.value.length - 1,
      // 节点大小
      symbolSize: getNodeSize(degree),
      // 图形样式
      itemStyle,
      // 标签
      label: {
        ...label,
        // 度数足够大时展示
        show: degree >= props.nodeLabelVisibleDegree,
        fontSize: 10,
      }
    }
  }).filter(({ value }) => value >= props.nodeVisibleDegree)
})

/**
 * ECharts 关系图的 edges
 * 带有链接的边高亮显示
 * @return {Array} edges
 */
const edges = computed(() => {
  return props.edges.map(item => ({
    ...item,
    value: item.predicate || '-',
    // 关系边的线条样式
    lineStyle: {
      // 线的颜色
      color: item.link && props.linkEdgeColor,
    },
  }))
})

/**
 * ECharts option
 * @return {Object} option
 */
const option = computed(() => ({
  // 标题
  title: {
    text: props.title,
    top: 8,
    left: 8
  },
  // 图例
  legend: {
    type: 'scroll',
    top: commonUtil.isNotEmpty(props.title) && 36 || 0,
    left: 8,
    orient: 'vertical',
    data: legends.value,
  },
  // 提示框
  tooltip: {
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
        // 节点提示框内容
        node: `${name}（关联 ${value} 个节点）`,
        // 边提示框内容
        edge: `${source} ${value} ${target}`,
      }[dataType] || ''
      if (description) {
        // 附带描述的项目追加描述
        str += `${str.length && '<br/>' || ''}${description.replace(/\n/g, '<br/>')}`
      }
      if (link) {
        // 附带链接的项目追加“点击查看详情”
        str += `${str.length && '<br/>' || ''}点击查看详情`
      }
      return '<div class="tooltip-inner">' + str + '</div>'
    },
  },
  series: [{
    type: 'graph',
    layout: 'force',
    // 力引导布局相关的配置项
    force: Object.assign({}, DEFAULT_FORCE, props.force),
    // 是否开启鼠标缩放和平移漫游
    roam: true,
    // 节点是否可拖拽，只在使用力引导布局的时候有用
    draggable: true,
    // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点
    focusNodeAdjacency: props.focusNodeAdjacency,
    // 图形样式
    itemStyle: {
      // 图形的描边颜色
      borderColor: '#fff',
      // 描边线宽
      borderWidth: 1,
      // 图形阴影的模糊大小
      shadowBlur: 10,
      // 阴影颜色
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    },
    // 图形上的文本标签
    label: {
      // 标签的位置
      position: 'right',
      // 距离图形元素的距离
      distance: 3,
      formatter: '{b}',
    },
    // 关系边上的文本标签
    edgeLabel: {
      formatter: '{c}',
    },
    // 高亮的图形样式
    emphasis: {
      lineStyle: {
        // 线宽
        width: 4,
      },
    },
    categories: categories.value,
    nodes: nodes.value,
    edges: edges.value,
  }],
  color: props.color,
}))

/**
 * 包含关键字所得的选项列表
 * @return {Array} 选项列表
 */
const keywords = computed(() => {
  const { keyword } = search
  if (commonUtil.isEmpty(keyword)) {
    return []
  }
  return props.nodes.filter(item => item.name?.includes(keyword)).map(item => item.name)
})

/**
 * 点击操作
 * 如果项目附带链接，跳转至相应的地址
 * @param {Object} [data={}] 点击事件
 */
function onClick({ data = {} } = {}) {
  if (data.link) {
    window.open(withBase(data.link), '_blank')
  }
}

/**
 * 实现关键字的反向数据流，这里用到了防抖，延时 300ms
 * @param {Object} e 事件
 */
function handleKeywordInput(e) {
  if (search.timer) {
    // 重新计时
    clearTimeout(search.timer)
  }
  search.timer = setTimeout(() => {
    search.keyword = e.target.value
  }, 300)
}

/**
 * 关键字输入框 blur 事件触发隐藏关键字选项下拉框
 * 此事件的触发先于选项的 click 事件，隐藏下拉列表后，会阻碍选项的选中
 * 这里需要等待选项的 click 事件完成后，再隐藏
 */
function handleKeywordBlur() {
  setTimeout(() => {
    search.showOptions = false
  }, 100)
}
</script>

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
        <!-- <label>关键字</label> -->
        <div class="content">
          <div class="input" ref="select">
            <input
              type="text"
              :value="search.keyword"
              placeholder="输入关键字搜索..."
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

<style lang="scss" scoped>
$BORDER_RADIUS: 3px;
$BORDER_COLOR: #cfd4db;
$BORDER_COLOR_LIGHT: #eee;
$LABEL_WIDTH: 60px;

.knowledge-graph {
  position: relative;
  margin: 20px auto;
  border: 1px solid $BORDER_COLOR_LIGHT;

  /**
   * 搜索工具样式
   */
  .search-tool {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.6);

    .item {
      padding: 5px;
      font-size: 14px;

      label {
        width: $LABEL_WIDTH;
        height: 100%;
        text-align: right;
        vertical-align: middle;
        float: left;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        line-height: 22px;
      }

      .content {
        position: relative;
        // margin-left: $LABEL_WIDTH;

        .input {
          input {
            width: 10rem;
            border: 1px solid $BORDER_COLOR;
            border-radius: $BORDER_RADIUS;
            padding: 2px 1.2rem 2px 5px;
            outline: none;
            // background: #fff url("@vuepress/plugin-search/lib/client/styles/search.svg") 8.9rem 0.2rem no-repeat; // 使用默认主题的搜索 svg 图标
            box-sizing: border-box;
            font-size: 14px;

            &:focus {
              border-color: #3eaf7c;
            }
          }

          .options {
            position: absolute;
            top: 10px;
            left: 0;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid $BORDER_COLOR;
            border-radius: $BORDER_RADIUS;
            padding: 0;
            list-style: none;
            background-color: #fff;

            .option {
              min-width: 9.9rem;
              border-bottom: 1px solid $BORDER_COLOR_LIGHT;
              padding: 3px 6px;
              box-sizing: border-box;
              line-height: 20px;
              font-size: 14px;
              cursor: pointer;

              &:last-of-type {
                border: 0;
              }

              &:hover {
                background-color: #f3f5f7;
              }
            }
          }
        }
      }
    }
  }

  :deep(.tooltip-inner) {
    max-width: 500px;
    white-space: normal;
  }
}
</style>

/**
 * 响应式的 ECharts 组件
 */

<template lang="html">
  <div
    class="responsive-echarts"
    :style="`width: ${width}; height: ${height};`"
  />
</template>

<script>
import echarts from 'echarts/lib/echarts' // 此处不引入具体的 ECharts 组件

export default {
  props: {
    /**
     * ECharts 的 option
     * @param {Object}
     */
    option: {
      type: Object,
      default: () => ({})
    },

    /**
     * 宽度，默认 100%
     * @param {String}
     */
    width: {
      type: String,
      default: '100%'
    },

    /**
     * 高度，默认 100%
     * @param {String}
     */
    height: {
      type: String,
      default: '100%'
    },

    /**
     * 加载状态
     * @param {Boolean}
     */
    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      /**
       * 存放 ECharts 实例
       * @param {Object}
       */
      myChart: null
    }
  },

  mounted () {
    // 首次绘制
    this.draw()
    // 添加 resize 事件监听器
    window.addEventListener('resize', this.myChart && this.myChart.resize)
  },

  beforeDestroy () {
    // 销毁实例
    this.myChart && this.myChart.dispose && this.myChart.dispose()
    // 移除 resize 事件监听器
    window.removeEventListener('resize', this.myChart && this.myChart.resize)
  },

  watch: {
    /**
     * 监听 option 属性的变化
     */
    option: {
      handler (newVal, oldVal) {
        if (this.myChart) {
          if (newVal) { // 新值存在时使用新值
            this.myChart.setOption(newVal, true)
          } else { // 否则使用旧值
            this.myChart.setOption(oldVal, true)
          }
        } else { // 未初始化时进行绘制
          this.draw()
        }
      },
      deep: true // 深监听
    },

    /**
     * 监听 loading 属性的变化
     */
    loading (val) {
      if (val) { // 开始 loading 态
        this.myChart.showLoading()
      } else { // 结束 loading 态
        this.myChart.hideLoading()
      }
    }
  },

  methods: {
    /**
     * 绘制 ECharts
     */
    draw () {
      const el = this.$el
      this.myChart = echarts.init(el, '')
      this.myChart.setOption(this.option)
      // 绑定点击事件
      this.myChart.on('click', e => {
        this.$emit('click', e)
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>

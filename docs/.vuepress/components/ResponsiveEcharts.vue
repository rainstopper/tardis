<!--
响应式的 ECharts 组件
 -->

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
// 此处不引入具体的 ECharts 组件
import * as echarts from 'echarts/lib/echarts'

const emit = defineEmits(['click'])

const props = defineProps({
  /**
   * ECharts 的 option
   * @param {Object}
   */
  option: {
    type: Object,
    default: () => ({}),
  },

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
   * 加载状态
   * @param {Boolean}
   */
  loading: {
    type: Boolean,
    default: false,
  },
})

let instance = null

const el = ref(null)

const draw = () => {
  if (el.value) {
    instance = echarts.init(el.value, '')
    instance.setOption(props.option)
    // 绑定点击事件
    instance.on('click', e => {
      emit('click', e)
    })
  }
}

onMounted(() => {
  // 首次绘制
  draw()
  // 添加 resize 事件监听器
  window.addEventListener('resize', instance?.resize)
})

onBeforeUnmount(() => {
  // 销毁实例
  instance?.dispose?.()
  // 移除 resize 事件监听器
  window.removeEventListener('resize', instance?.resize)
})

watch(() => props.option, (newVal, oldVal) => {
  if (instance) {
    if (newVal) {
      // 新值存在时使用新值
      instance.setOption(newVal, true)
    } else {
      // 否则使用旧值
      instance.setOption(oldVal, true)
    }
  } else {
    // 未初始化时进行绘制
    draw()
  }
}, { immediate: true })

watch(() => props.loading, val => {
  if (val) {
    // 开始 loading 态
    instance?.showLoading()
  } else {
    // 结束 loading 态
    instance?.hideLoading()
  }
})
</script>

<template lang="html">
  <div ref="el" class="responsive-echarts" :style="{ width, height }" />
</template>

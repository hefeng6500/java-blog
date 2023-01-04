<template>
  <div :class="className">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: String
})

const className = computed(() => {
  return ['tag', props.type]
})

</script>

<style lang="scss" scoped>
.tag {
  margin: 30px 8px 10px 0;
  display: inline-block;
  height: auto;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 4px;
  background-color: #fafafa;

  &.primary {
    background-color: rgb(16, 142, 233);
    color: #fff;
  }

  &.success {
    background-color: rgb(135, 208, 104);
    color: #fff;
  }

  &.darkorchid {
    background-color:darkorchid;
    color: #fff;
  }
}
</style>
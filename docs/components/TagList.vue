<template>
  <Tag v-for="(tag, index) in props.list" :key="index" :type="tag.type">{{ tag.label }}</Tag>
</template>

<script setup>
import Tag from "./Tag.vue"

const props = defineProps({
  list: Array
})

</script>

<style lang="scss" scoped>

</style>
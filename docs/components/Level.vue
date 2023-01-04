<template>
  <div class="level-container">
    难度：
    <span :class="levelClass">{{ levelLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Tag from "./Tag.vue";

const props = defineProps({
  level: Array,
});

const levelLabel = computed(() => {
  const map = {
    easy: "简单",
    middle: "中等",
    difficulty: "较难",
  };

  return map[props.level];
});

const levelClass = computed(() => {
  const map = {
    easy: "easy",
    middle: "middle",
    difficulty: "difficulty",
  };

  return map[props.level];
});
</script>

<style lang="scss" scoped>
.level-container {
  margin: 10px 0;
}
.easy {
  color: rgb(0, 175, 155);
}

.middle {
  color: rgb(255, 184, 0);
}

.difficulty {
  color: rgb(255, 45, 85);
}
</style>

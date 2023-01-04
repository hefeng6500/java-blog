<template>
  <div class="container">
    <Editor
      class="item"
      :value="value"
      :plugins="plugins"
      @change="handleChange"
    />
    <Viewer class="item" :value="value"></Viewer>
  </div>
</template>

<script setup>
import "bytemd/dist/index.css";

import { ref } from "vue";
import gfm from "@bytemd/plugin-gfm";
import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import highlightssr from "@bytemd/plugin-highlight-ssr";
import math from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import { Editor, Viewer } from "@bytemd/vue-next";

import "katex/dist/katex.css";

const plugins = ref([
  gfm(),
  breaks(),
  frontmatter(),
  gemoji(),
  highlightssr(),
  math(),
  mediumZoom(),
  mermaid(),
]);

const value = ref("<h1>123</h1>");
const handleChange = (val) => {
  value.value = val;
};
</script>

<style scoped>
.container {
  width: 100%;
  background: #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  width: 50%;
  height: 500px;
}
</style>

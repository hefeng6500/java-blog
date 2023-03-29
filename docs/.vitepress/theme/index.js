import DefaultTheme from "vitepress/theme"
import MyLayout from "./MyLayout.vue"

import { onMounted, watch, nextTick } from "vue"
import { inBrowser, useRoute } from "vitepress"
import mediumZoom from "medium-zoom"
import hljs from "highlight.js/lib/core"
import java from "highlight.js/lib/languages/java"

// import "github-markdown-css";
import "./index.scss"
import "highlight.js/styles/github.css"

hljs.registerLanguage("java", java)

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
  },

  setup() {
    const route = useRoute()
    watch(
      () => route.path,
      () =>
        nextTick(() => {
          if (inBrowser)
            mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" })
        }),
      { immediate: true }
    )
  },
}

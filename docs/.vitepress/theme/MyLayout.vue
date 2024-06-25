<script setup>
import { watch, nextTick, ref } from "vue";
import DefaultTheme from "vitepress/theme";
import md5 from "md5";
import Comment from "../../components/comment/index.vue";
import UtterancCommment from "../../components/UtterancCommment/index.vue";
import { useRouter } from "vitepress";
import { onMounted } from "vue";
import { generateTongji } from "../utils";
import Footer from "./Footer.vue";

const { Layout } = DefaultTheme;
const enableComment = ref(true);
let { route } = useRouter();
let badge = ref("");

onMounted(() => {
  generateTongji();
});

const generateBadge = (path) => {
  const id = md5(path);

  return `https://visitor-badge.glitch.me/badge?page_id=${id}`;
};

generateBadge(route.path);

watch(
  route,
  async function (newValue) {
    enableComment.value = false;
    nextTick(() => {
      enableComment.value = true;
    });

    badge.value = generateBadge(route.path);
  },
  { immediate: true }
);
</script>

<!-- Hotjar Tracking Code for Java-Blog -->
<script>
(function (h, o, t, j, a, r) {
  h.hj =
    h.hj ||
    function () {
      (h.hj.q = h.hj.q || []).push(arguments);
    };
  h._hjSettings = { hjid: 5035822, hjsv: 6 };
  a = o.getElementsByTagName("head")[0];
  r = o.createElement("script");
  r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
})(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
</script>

<template>
  <Layout>
    <template #doc-after>
      <div>
        <!-- <Comment v-if="enableComment" /> -->
        <UtterancCommment v-if="enableComment" />
      </div>
      <div class="record">
        <img v-if="badge" :src="badge" alt />
      </div>
    </template>
    <template #home-hero-after>
      <Footer />
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
.record {
  padding: 20px 0 40px;
  display: flex;
  justify-content: center;
}
</style>

<style>
.medium-zoom-image--opened {
  z-index: 9999;
}
</style>

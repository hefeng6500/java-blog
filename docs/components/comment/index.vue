<template>
  <div id="gitalk-container"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vitepress";
import md5 from "md5";
import Gitalk from "gitalk";
import "gitalk/dist/gitalk.css";

let { route } = useRouter();

onMounted(() => {
  renderComment();
});

const renderComment = () => {
  const id = md5(route.path);
  const gitalk = new Gitalk({
    clientID: "8760b254461e3650fc51",
    clientSecret: "ca8c12795123d4605d8d98a2753f2b5d78049832",
    repo: "interview-blog",
    owner: "hefeng6500",
    admin: ["hefeng6500"],
    id,
    distractionFreeMode: false,
  });

  gitalk.render("gitalk-container");
};
</script>

<style scoped>
:deep(.gt-meta) {
  z-index: 1;
}
</style>

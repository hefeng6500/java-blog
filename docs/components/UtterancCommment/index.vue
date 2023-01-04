<template>
  <div id="content"></div>
</template>

<script setup>
import { onMounted } from "vue";
onMounted(() => {
  const utterances = document.createElement("script");
  utterances.type = "text/javascript";
  utterances.async = true;
  utterances.setAttribute("issue-term", "title");
  utterances.setAttribute("theme", "github-light");
  utterances.setAttribute("repo", "hefeng6500/interview-blog");
  utterances.crossorigin = "anonymous";
  utterances.src = "https://utteranc.es/client.js";
  document.getElementById("content").appendChild(utterances);
});
</script>

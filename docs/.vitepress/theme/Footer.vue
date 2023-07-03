<template>
  <div class="footer">
    <span class="power-by">
      Powered by
      <a href="https://vitepress.dev" target="_blank" rel="noopener" title=""
        >VitePress</a
      >
    </span>

    <span class="icp">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"
        >粤ICP备2023071077号</a
      >
    </span>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 20px;
  background: #fff;
  text-align: center;
}
.power-by {
  font-size: 14px;

  a {
    text-decoration: underline;
    color: var(--vp-home-hero-name-color);
  }
}
.icp {
  margin-left: 20px;
  font-size: 14px;
  text-decoration: none;
}
</style>

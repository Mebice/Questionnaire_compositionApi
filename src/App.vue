<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div class="bgArea">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.bgArea {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5ed;

  .fa-trash,
  .fa-square-plus {
    font-size: 18pt;
    color: #fff;

    &:hover {
      color: #DBD3A4;
      cursor: pointer;
    }
  }
}
</style>

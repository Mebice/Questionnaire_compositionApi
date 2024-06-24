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
  background-color: #f4f4ed;

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

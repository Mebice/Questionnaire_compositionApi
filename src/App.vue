<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- <header>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
  </header> -->
  <div class="bgArea">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.bgArea{
  background-color: #f4f4ed;
}
</style>

<template>
  <div class="about">
    <h1>about</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script setup>
import { useRoute } from 'vue-router'

  const route = useRoute()
  
</script>

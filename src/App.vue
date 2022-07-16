<script setup>
  import Header from './components/Header.vue'
  import { api } from './services/api'
</script>

<template>
  <div class="w-screen h-screen bg-slate-800 font-poppins">
    <Header />
    <main class="flex flex-col items-center justify-center h-5/6 gap-12">
      <router-view />
    </main>
  </div>
</template>
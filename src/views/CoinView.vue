<template>
  <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
    <CoinChart :chartId= "route.params.id"/>
    <CoinCard :coinId = "route.params.id"/>
  </div>
</template>

<script setup>
import CoinChart from '@/components/CoinChart.vue'
import CoinCard from '@/components/CoinCard.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
  
</script>

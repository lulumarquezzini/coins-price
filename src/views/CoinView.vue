<template>
  <CoinChart :chartId= "route.params.id"/>
</template>

<script setup>
import CoinChart from '@/components/CoinChart.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
  
</script>

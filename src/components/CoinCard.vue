<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">{{coin.data.name}} Price Statistics</div>
            <table class="w-full mt-4">
                <tbody>
                    <tr class="border-b">
                        <th class="text-left">Price</th>
                        <td class="text-right">{{ formatCurrency(coin.currentPrice, 8)}}</td>
                    </tr>
                    <tr class="border-b">
                        <th class="text-left">24h Low </th>
                        <td class="text-right">{{ formatCurrency(coin.low24h)}}</td>
                    </tr>
                    <tr class="border-b">
                        <th class="text-left">24h High </th>
                        <td class="text-right">{{ formatCurrency(coin.high24h)}}</td>
                    </tr>
                    <tr class="border-b">
                        <th class="text-left">All-Time Low </th>
                        <td class="text-right">{{ formatCurrency(coin.allTimeLow)}}</td>
                    </tr>
                    <tr class="border-b">
                        <th class="text-left">All-Time High </th>
                        <td class="text-right">{{ formatCurrency(coin.allTimeHigh)}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="font-bold text-xl mt-2 mb-2">Select a Date:</div>
            <input v-model="coinDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="date">
            <p class="text-red-500 text-xs italic">{{canSearch ? '' : 'Please do not select a date greater than today'}}</p>
            <h3 class="text-3xl text-center text-gray-700 font-semibold leading-tight my-3">{{formatCurrency(historicalValue, 2) == '$0.00' ? formatCurrency(historicalValue, 8) : formatCurrency(historicalValue, 2)}}</h3>
            <p class="text-xs text-center leading-tight">{{stringToDate(coinDate)}}</p>
        </div>
    </div>
</template>

<script setup>
import { api } from '../services/api'
import { formatCurrency } from './utils'
import { reactive, ref, watchEffect, computed } from 'vue'

const props = defineProps(['coinId'])

const coinDate = ref(dateToString(new Date()))
const historicalValue = ref(null);

const canSearch = computed(() => {
    const date1 = convertToDate(coinDate.value)
    const date2 = new Date();
    const date1WithoutTime = new Date(date1.getTime());
    const date2WithoutTime = new Date(date2.getTime());
    date1WithoutTime.setUTCHours(0, 0, 0, 0);
    date2WithoutTime.setUTCHours(0, 0, 0, 0);

    return date1WithoutTime <= date2WithoutTime
})

watchEffect(async () => {
    const [y, m, d] = coinDate.value.split('-');
    const dateApi = d + '-' + m + '-' + y
    historicalValue.value = await api.get(`/coins/${props.coinId}/history?date=${dateApi}`)
                                    .then((response) => { return response.data.market_data.current_price.usd })
})

const coin = reactive({
    data: [],
    currentPrice: 0.00,
    low24h: 0.00,
    high24h: 0.00,
    allTimeLow: 0.00,
    allTimeHigh: 0.00,
});

function convertToDate(str) {
  const [y, m, d] = str.split('-')
  return new Date(+y, m - 1, +d)
}

function stringToDate(str) {
  return str.replace(/-/g, '/')
}

function pad(n, s = String(n)) {
  return s.length < 2 ? `0${s}` : s
}

function dateToString(date) {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate())
  )
}

async function fetchData() {
  try {
    coin.data = await api.get(`/coins/${props.coinId}`)
        .then((response) => {
            coin.currentPrice = response.data.market_data.current_price.usd
            coin.low24h = response.data.market_data.low_24h.usd
            coin.high24h = response.data.market_data.high_24h.usd
            coin.allTimeHigh = response.data.market_data.ath.usd
            coin.allTimeLow = response.data.market_data.atl.usd
            return response.data;
        })
  }
  catch (e) {
    console.error(e)
  }
}

fetchData()

</script>
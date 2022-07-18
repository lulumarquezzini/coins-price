<template>
	<div class="flex flex-col mt-2 w-3/4">
		<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
				<div class="shadow overflow-hidden sm:rounded-lg">
					<table class="min-w-full text-sm text-gray-400">
						<thead class="bg-gray-800 text-xs uppercase font-medium">
							<tr>
								<th></th>
								<th scope="col" class="px-6 py-3 text-left tracking-wider">
									Coin
								</th>
								<th scope="col" class="px-6 py-3 text-left tracking-wider">
									Price
								</th>
								<th scope="col" class="px-6 py-3 text-left tracking-wider">
									24h
								</th>
								<th scope="col" class="px-6 py-3 text-left tracking-wider">
									7d
								</th>
								<th scope="col" class="px-6 py-3 text-left tracking-wider">
									30d
								</th>
								<th scope="col" class="px-6 py-3 text-left tracking-wider">
                                    market cap
								</th>
							</tr>
						</thead>
						<tbody v-for="(item, index) in list.coinsList" :key="item" class="bg-gray-800">
							<tr class="bg-black bg-opacity-20 cursor-pointer hover:bg-slate-700" @click="goToCoinPage(item._id)">
								<td class="pl-4">
									{{ index + 1}}
								</td>
								<td class="flex px-6 py-4 whitespace-nowrap">
                                    <img class="w-5" :src="item._image">
                                    <span class="ml-2 font-medium">{{item._coin}}</span>
                                </td>
								<td class="px-6 py-4 whitespace-nowrap">
									 {{ formatCurrency(item.current_price.usd, 8) }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap" :class="textColor(item.price_change_percentage_24h)">
									<div class="flex items-center">
										<div class="h-0 w-0" :class="triangleColor(item.price_change_percentage_24h)"></div>
										{{ formatAsPercent(item.price_change_percentage_24h) }}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap" :class="textColor(item.price_change_percentage_7d)">
									<div class="flex items-center">
										<div class="h-0 w-0" :class="triangleColor(item.price_change_percentage_7d)"></div>
                                    	{{ formatAsPercent(item.price_change_percentage_7d) }}	
									</div>
								</td>
                                <td class="px-6 py-4 whitespace-nowrap" :class="textColor(item.price_change_percentage_30d)">
									<div class="flex items-center">
										<div class="h-0 w-0" :class="triangleColor(item.price_change_percentage_30d)"></div>
										{{ formatAsPercent(item.price_change_percentage_30d) }}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
                                    {{ formatCurrency(item.market_cap.usd, 0) }}
								</td>
                            </tr>
						</tbody>
					</table>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { formatCurrency } from './utils'
import bitcoinImg from "../assets/bitcoin.png"
import dacxiImg from "../assets/dacxi.png"
import ethImg from "../assets/ethereum.png"
import atomImg from "../assets/atom.png"
import lunaImg from "../assets/luna.png"

const coins = ['bitcoin', 'dacxi', 'ethereum', 'cosmos', 'terra-luna-2']
const images = [bitcoinImg, dacxiImg, ethImg, atomImg, lunaImg]
const router = useRouter()
const list = reactive({
    coinsList: [],
});

const fetchCoins = () => {
	Promise.all(
		coins.map((item, index) =>
			api
			.get(`/coins/${item}`)
			.then((response) => ({ 
			...response.data.market_data, 
			_coin: response.data.name,
			_image: images[index],
			_id: item,
			}))
		)
	).then((result) => (
		list.coinsList = result.sort(function(a,b){return a.market_cap_rank - b.market_cap_rank})
	));
}

const formatAsPercent = (number) => {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number / 100);
}

const textColor = (number) => {
	return number >= 0 ? 'text-green-500' : 'text-red-500'
}

const triangleColor = (number) => {
	return number >= 0 ? 'border-x-4 border-x-transparent border-b-[4px] border-b-green-500' : 'border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[4px] border-t-red-500'
}

const goToCoinPage = (id) => {
	router.push(`/coin/${id}`)
}

var interval = null;
onMounted(() => {
	fetchCoins();
	interval = setInterval(() => {
		fetchCoins();
	}, 30000)
})

onUnmounted(() => {
	clearInterval(interval);
})


</script>

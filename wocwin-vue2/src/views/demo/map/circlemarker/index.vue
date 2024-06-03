<template>
	<t-layout-page class="circle-marker">
		<div id="container"></div>
	</t-layout-page>
</template>
<script>
import { capitals } from './capitals'
export default {
	name: 'Circlemarker',
	data() {
		return {
			map: null,
			circles: [
				[116.493195, 39.993253],
				[116.473195, 39.993253],
				[116.453195, 39.993253],
				[116.493195, 39.973253],
				[116.473195, 39.973253],
				[116.453195, 39.973253],
				[116.493195, 39.953253],
				[116.473195, 39.953253],
				[116.453195, 39.953253]
			]
		}
	},
	mounted() {
		//调用地图初始化方法
		this.initAMap()
	},
	methods: {
		initAMap() {
			let map = new AMap.Map('container', {
				// resizeEnable: true,
				zoom: 4,
				center: [113.276517, 23.151382]
			})
			for (let i = 0; i < capitals.length; i += 1) {
				let center = capitals[i].center
				let circleMarker = new AMap.CircleMarker({
					center: center,
					radius: 10 + Math.random() * 10, //3D视图下，CircleMarker半径不要超过64px
					// radius: 9000,
					strokeColor: 'white',
					strokeWeight: 2,
					strokeOpacity: 0.5,
					// fillColor: 'rgba(0,0,255,1)',
					fillColor: this.rgb(),
					fillOpacity: 0.5,
					zIndex: 10,
					bubble: true,
					cursor: 'pointer',
					clickable: true
				})
				circleMarker.setMap(map)
			}
		},
		// rgb颜色随机
		rgb() {
			const r = Math.floor(Math.random() * 256)
			const g = Math.floor(Math.random() * 256)
			const b = Math.floor(Math.random() * 256)
			return `rgb(${r},${g},${b})`
		}
	}
}
</script>

<style lang="scss" scoped>
.circle-marker {
	position: relative;
	#container {
		width: 100%;
		height: 100%;
	}
}
</style>

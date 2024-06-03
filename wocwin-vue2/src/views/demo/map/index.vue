<template>
	<t-layout-page class="map_localization">
		<div id="container"></div>
		<div class="input-item">
			<div class="title">左击获取经纬度</div>
			<el-input v-model="lnglat">
				<template slot="prepend">经纬度</template>
			</el-input>
			<el-input style="margin-top: 5px" v-model="address">
				<template slot="prepend">地址</template>
			</el-input>
		</div>
		<div class="cursor-item">
			<div class="title">测距</div>
			<!-- <el-radio-group v-model="mouseStyle">
        <el-radio class="mouseStyle" label="default" @change="switchCursor">箭头</el-radio>
        <el-radio class="mouseStyle" label="pointer" @change="switchCursor">手型</el-radio>
        <el-radio class="mouseStyle" label="move" @change="switchCursor">交叉箭头</el-radio>
        <el-radio class="mouseStyle" label="crosshair" @change="switchCursor">十字线</el-radio>
      </el-radio-group>-->
			<el-button round size="mini" @click="defaultStyle">默认样式测距</el-button>
			<el-button round size="mini" @click="customStyle">自定义样式测距</el-button>
		</div>
		<div class="circle-item">
			<div class="title">添加Circle</div>
			<div class="item">
				<el-button size="mini" round @click="addCircle">添加Circle</el-button>
				<el-button size="mini" round @click="removeCircle">删除Circle</el-button>
			</div>
		</div>
	</t-layout-page>
</template>
<script>
export default {
	name: 'MapLocalization',
	data() {
		return {
			mouseStyle: 'pointer',
			map: null,
			circle: null,
			ruler1: null,
			ruler2: null,
			lnglat: '113.276517,23.151382',
			address: ''
		}
	},
	computed: {},
	mounted() {
		//调用地图初始化方法
		this.initAMap()
		this.regeoCode()
	},
	methods: {
		initAMap() {
			this.map = new AMap.Map('container', {
				resizeEnable: true,
				zoom: 15,
				center: [113.276517, 23.151382]
			})
			//默认样式
			this.ruler1 = new AMap.RangingTool(this.map)
			//自定义样式
			let startMarkerOptions = {
				icon: new AMap.Icon({
					size: new AMap.Size(19, 31), //图标大小
					imageSize: new AMap.Size(19, 31),
					image: '//webapi.amap.com/theme/v1.3/markers/b/start.png'
				}),
				offset: new AMap.Pixel(-9, -31)
			}
			let endMarkerOptions = {
				icon: new AMap.Icon({
					size: new AMap.Size(19, 31), //图标大小
					imageSize: new AMap.Size(19, 31),
					image: '//webapi.amap.com/theme/v1.3/markers/b/end.png'
				}),
				offset: new AMap.Pixel(-9, -31)
			}
			let midMarkerOptions = {
				icon: new AMap.Icon({
					size: new AMap.Size(19, 31), //图标大小
					imageSize: new AMap.Size(19, 31),
					image: '//webapi.amap.com/theme/v1.3/markers/b/mid.png'
				}),
				offset: new AMap.Pixel(-9, -31)
			}
			let lineOptions = {
				strokeStyle: 'solid',
				strokeColor: '#FF33FF',
				strokeOpacity: 1,
				strokeWeight: 2
			}
			let rulerOptions = {
				startMarkerOptions: startMarkerOptions,
				midMarkerOptions: midMarkerOptions,
				endMarkerOptions: endMarkerOptions,
				lineOptions: lineOptions
			}
			this.ruler2 = new AMap.RangingTool(this.map, rulerOptions)
			//使用CSS默认样式定义地图上的鼠标样式
			this.map.setDefaultCursor('pointer')
			//绑定地图移动事件
			this.map.on('click', e => {
				this.lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat()
				this.regeoCode()
			})
		},
		//添加Circle
		addCircle() {
			// 构造矢量圆形
			this.circle = new AMap.Circle({
				center: [113.276517, 23.151382], // 圆心位置
				radius: 4500, //半径
				strokeColor: '#F33', //线颜色
				strokeOpacity: 1, //线透明度
				strokeWeight: 3, //线粗细度
				fillColor: '#ee2200', //填充颜色
				fillOpacity: 0.35 //填充透明度
			})
			this.map.add(this.circle)
			this.map.setFitView()
		},
		//删除Circle
		removeCircle() {
			this.map.remove(this.circle)
			this.map.setFitView()
		},
		//自定义鼠标样式图标
		switchCursor() {
			this.map.setDefaultCursor(this.mouseStyle)
		},
		//默认样式测距
		defaultStyle() {
			this.ruler2.turnOff()
			this.ruler1.turnOn()
		},
		//自定义样式测距
		customStyle() {
			this.ruler1.turnOff()
			this.ruler2.turnOn()
		},
		// 逆地理编码，根据经纬度获取地址信息
		regeoCode() {
			this.map.clearMap()
			let lnglat = this.lnglat.split(',')
			let marker = new AMap.Marker()
			let geocoder = new AMap.Geocoder({
				city: '020' //城市设为广州，默认：“全国”
				// radius: 1000, //范围，默认：500
				// extensions: 'all'
			})
			this.map.add(marker)
			marker.setPosition(lnglat)
			geocoder.getAddress(lnglat, (status, result) => {
				if (status === 'complete' && result.regeocode) {
					this.address = result.regeocode.formattedAddress
				} else {
					this.$message.error('根据地址查询位置失败，请重新选择！')
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.map_localization {
	position: relative;
	#container {
		width: 100%;
		height: 100%;
	}
	.circle-item {
		position: absolute;
		background: white;
		padding: 5px 20px 10px;
		right: 6px;
		bottom: 170px;
		.title {
			font-weight: bold;
			font-size: 16px;
			margin-bottom: 10px;
		}
		.item {
			margin: 10px 0px;
		}
	}
	.input-item {
		position: absolute;
		background: white;
		padding: 15px;
		right: 30px;
		bottom: 10px;
		.title {
			font-weight: bold;
			font-size: 16px;
			margin-bottom: 10px;
		}
	}
	.cursor-item {
		position: absolute;
		background: white;
		padding: 5px 20px 10px;
		right: 340px;
		bottom: 170px;
		.title {
			font-weight: bold;
			font-size: 16px;
			margin-bottom: 10px;
		}
		.mouseStyle {
			display: block;
			padding: 5px 20px 10px;
		}
	}
}
</style>

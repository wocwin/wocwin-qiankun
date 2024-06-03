<template>
	<t-layout-page class="map_control">
		<div id="container"></div>
		<div class="control-item">
			<h5>地图控件</h5>
			<el-checkbox class="control" v-model="scaleStatus" @change="changeScaleStatus">比例尺</el-checkbox>
			<el-checkbox class="control" v-model="toolBarStatus" @change="changeToolBarStatus">工具条</el-checkbox>
			<el-checkbox class="control" v-model="controlBarStatus" @change="changeControlBarStatus">工具条方向盘</el-checkbox>
			<el-checkbox class="control" v-model="overViewStatus" @change="changeOverViewStatus">显示鹰眼</el-checkbox>
		</div>
	</t-layout-page>
</template>
<script>
export default {
	name: 'MapControl',
	data() {
		return {
			map: null,
			scale: null,
			toolBar: null,
			controlBar: null,
			overView: null,
			scaleStatus: true,
			toolBarStatus: true,
			controlBarStatus: true,
			overViewStatus: true
		}
	},
	mounted() {
		//调用地图初始化方法
		this.initAMap()
	},
	methods: {
		initAMap() {
			//控件
			this.scale = new AMap.Scale()

			this.toolBar = new AMap.ToolBar({
				position: {
					top: '110px',
					right: '40px'
				}
			})

			this.controlBar = new AMap.ControlBar({
				position: {
					top: '10px',
					right: '10px'
				}
			})

			this.overView = new AMap.HawkEye({
				opened: false
			})

			this.map = new AMap.Map('container', {
				viewMode: '3D',
				zoom: 11,
				pitch: 30
			})

			//给地图添加控件
			this.map.addControl(this.scale)
			this.map.addControl(this.toolBar)
			this.map.addControl(this.controlBar)
			this.map.addControl(this.overView)
		},
		changeScaleStatus() {
			if (this.scaleStatus) {
				this.scale.show()
			} else {
				this.scale.hide()
			}
		},
		changeToolBarStatus() {
			if (this.toolBarStatus) {
				this.toolBar.show()
			} else {
				this.toolBar.hide()
			}
		},
		changeControlBarStatus() {
			if (this.controlBarStatus) {
				this.controlBar.show()
			} else {
				this.controlBar.hide()
			}
		},
		changeOverViewStatus() {
			if (this.overViewStatus) {
				this.overView.show()
			} else {
				this.overView.hide()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.map_control {
	position: relative;
	#container {
		width: 100%;
		height: 100%;
	}
	.control-item {
		position: absolute;
		background: white;
		margin: 10px 30px 10px;
		padding: 10px 5px;
		left: 50px;
		top: 30px;
		.control {
			display: block;
			padding: 5px 20px 10px;
		}
	}
}
</style>

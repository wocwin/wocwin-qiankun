<template>
  <t-layout-page class="geocoding">
    <div id="container"></div>
    <div class="input-card">
      <label>行政区选择</label>
      <div class="input-item">
        <span class="input-item-text">省市区</span>
        <el-cascader
          style="width:100%;"
          placeholder="请选择省市区"
          filterable
          clearable
          :options="regionData"
          v-model="selectedOptions"
          @change="handleQuery"
        />
      </div>
    </div>
  </t-layout-page>
</template>
<script>
import { regionData, codeToText } from 'element-china-area-data'
export default {
  name: 'Geocoding',
  data() {
    return {
      regionData,
      // selectedOptions: ['44', '4401', '440111'],
      lnglat: '', // 经纬度
      selectedOptions: [],
      radius: null, // 半径
      map: null,
      circles: [
        [113.246954, 23.116108],
        [113.243571, 23.140162],
        [113.234371, 23.093856],
        [113.218418, 23.122092],
        [113.262682, 23.092498],
        [113.290436, 23.141155],
        [113.236339, 23.069672],
        [113.267308, 23.164173],
        [113.201731, 23.151311],
        [113.205066, 23.077405],
        [113.260149, 23.055468],
        [113.314916, 23.086251],
        [113.336987, 23.131935],
        [113.26602, 23.205536],
        [113.307413, 22.960227],
        [113.51546, 23.082085],
        [113.822999, 23.284189]
      ],
    }
  },
  mounted() {
    //调用地图初始化方法
    this.initAMap()
  },
  methods: {
    initAMap() {
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 15,
        center: [113.276517, 23.151382]
      });
      // for (let i = 0; i < this.circles.length; i += 1) {
      //   let center = this.circles[i]
      //   let circle = new AMap.Circle({
      //     center: center,
      //     // radius: this.radius - 0,  // 半径
      //     radius: 1250,  // 半径
      //     // strokeColor: "#F33",  // 线颜色
      //     strokeColor: this.rgb(),  // 线颜色
      //     strokeOpacity: 1,  //线透明度
      //     strokeWeight: 3,  //线粗细度
      //     fillColor: "#7c7cfb",  //填充颜色
      //     fillOpacity: 0.35 //填充透明度
      //   })
      //   circle.setMap(this.map)
      //   // this.map.add(circle)
      //   // this.map.setFitView()
      // }
    },
    // rgb颜色随机
    rgb() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    },
    async handleQuery() {
      // if (!(this.selectedOptions.length > 0)) {
      //   this.$message.error('请先选择定位区域！')
      //   return
      // }
      // if (!this.radius) {
      //   this.$message.error('请输入圆形半径！')
      //   return
      // }
      console.log('区域码', this.selectedOptions)
      console.log('区域码转汉字', codeToText[this.selectedOptions[0]] + codeToText[this.selectedOptions[1]] + codeToText[this.selectedOptions[2]])
      this.map.clearMap()
      // const address = codeToText[this.selectedOptions[0]] + codeToText[this.selectedOptions[1]] + codeToText[this.selectedOptions[2]]
      // address && this.geoCode(address)
      let keyword;
      if (this.selectedOptions.length > 0) {
        keyword = this.selectedOptions[this.selectedOptions.length - 1]
      }
      // 创建行政区查询对象
      let district = new AMap.DistrictSearch({
        // 返回行政区边界坐标等具体信息
        extensions: 'all',
        // 设置查询行政区级别为 区
        level: 'district'
      })
      district.search(keyword, (status, result) => {
        // 获取边界信息
        let bounds = result.districtList[0].boundaries
        let polygons = []
        if (bounds) {
          for (let i = 0, l = bounds.length; i < l; i++) {
            //生成行政区划polygon
            let polygon = new AMap.Polygon({
              map: this.map,
              strokeWeight: 1,
              path: bounds[i],
              fillOpacity: 0.7,
              fillColor: '#CCF3FF',
              strokeColor: '#CC66CC'
            })
            polygons.push(polygon)
          }
          // 地图自适应
          this.map.setFitView()
        }
      })
    },
    // 地理编码，根据地址获取经纬度坐标
    geoCode(address) {
      let geocoder = new AMap.Geocoder({
        city: "010", //城市设为北京，默认：“全国”
      });
      var marker = new AMap.Marker();
      geocoder.getLocation(address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          let lnglat = result.geocodes[0].location
          this.lnglat = lnglat.lng + ',' + lnglat.lat;
          marker.setPosition(lnglat);
          this.map.add(marker);
          this.map.setFitView(marker);
        } else {
          this.$message.error('根据地址查询位置失败');
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.geocoding {
  position: relative;
  #container {
    width: 100%;
    height: 100%;
  }
  .input-card {
    position: absolute;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 30px;
    left: 30px;
    padding: 10px;
    width: 400px;
    .input-item {
      margin: 10px 0;
      display: flex;
      align-items: center;
      .input-item-text {
        display: inline-block;
        width: 150px;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
}
</style>

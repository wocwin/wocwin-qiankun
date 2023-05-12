<template>
  <t-layout-page class="circle-demo">
    <div id="container"></div>
    <div class="input-card" v-modal-drag>
      <label>
        店面选址测算
        <span style="margin-left:5px;font-size:14px;" v-if="circles.length>0">
          共计
          <span style="color:#355db4;">{{circles.length}}</span> 个选址
        </span>
      </label>
      <div class="input-item">
        <span class="input-item-text">省市区</span>
        <el-cascader
          style="width:100%;"
          placeholder="请选择省市区"
          filterable
          :options="regionData"
          v-model="selectedOptions"
        />
      </div>
      <div class="input-item">
        <span class="input-item-text">店面覆盖范围</span>
        <el-input placeholder="请输入店面覆盖范围" clearable v-model="radius">
          <template slot="append">公里</template>
        </el-input>
      </div>
      <div class="input-item">
        <span class="input-item-text">框圈显示</span>
        <el-checkbox style="width: 100%;" v-model="isShowCircle" @change="changeShowCircle">显示覆盖范围</el-checkbox>
      </div>
      <el-button type="primary" style="width: 100%;margin-bottom: 5px;" @click="handleQuery">选址测算</el-button>
      <div class="concrete" v-if="circles.length>0">
        <el-collapse v-model="activeName">
          <el-collapse-item title="具体店面地址" name="1">
            <!-- <label>具体店面地址</label> -->
            <ul class="address_content">
              <li
                class="info t-oneline-overflow-hidden"
                v-for="(item,index) in circles"
                :key="index"
              >{{item.fullAddress}}</li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </t-layout-page>
</template>
<script>
import { regionData } from 'element-china-area-data'
import DataList from './data.json'
export default {
  name: 'DemoCircle',
  data() {
    return {
      regionData,
      activeName: '1',
      lnglat: '', // 经纬度
      selectedOptions: [],
      radius: null, // 半径
      map: null,
      scale: null, // 比例尺
      controlBar: null, // 工具条方向盘
      toolBar: null, // 工具条
      overView: null, // 鹰眼
      circleList: [], // 圆圈数据
      circles: [],
      addressList: [], // 选址地点
      isShowCircle: false, // 是否框圈显示
    }
  },
  directives: {
    modalDrag: {
      bind(el) {
        let odiv = el   //获取当前元素
        odiv.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - odiv.offsetLeft
          let disY = e.clientY - odiv.offsetTop

          document.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX
            let top = e.clientY - disY
            //移动当前元素
            odiv.style.left = left + 'px'
            odiv.style.top = top + 'px'
          };
          document.onmouseup = (e) => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  mounted() {
    //调用地图初始化方法
    this.initAMap()
  },
  methods: {
    initAMap() {
      this.scale = new AMap.Scale();
      this.toolBar = new AMap.ToolBar({
        position: {
          top: '110px',
          right: '40px'
        }
      });

      this.controlBar = new AMap.ControlBar({
        position: {
          top: '10px',
          right: '10px'
        }
      });
      this.overView = new AMap.HawkEye({
        opened: false
      });

      this.map = new AMap.Map('container', {
        // resizeEnable: true,
        viewMode: '3D',
        zoom: 12,
        center: [113.265862, 23.126124]
      });
      //使用CSS默认样式定义地图上的鼠标样式
      this.map.setDefaultCursor("pointer");
      this.map.on('click', (e) => {
        console.log('左击经纬度----', e.lnglat)
        this.lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat();
      })
      this.map.addControl(this.scale)
      this.map.addControl(this.toolBar)
      this.map.addControl(this.controlBar)
      this.map.addControl(this.overView)
    },
    // rgb颜色随机
    rgb() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    },
    changeShowCircle() {
      if (this.isShowCircle) {
        this.circleList.map(item => {
          item.show()
        })
      } else {
        this.circleList.map(item => {
          item.hide()
        })
      }
    },
    async handleQuery() {
      if (!(this.selectedOptions.length > 0)) {
        this.$message.error('请先选择定位区域！')
        return
      }
      if (!this.radius) {
        this.$message.error('请输入店面覆盖范围！')
        return
      }
      // console.log('圆形半径', this.radius)
      // console.log('区域码', this.selectedOptions)
      const params = {
        code: this.selectedOptions[this.selectedOptions.length - 1] - 0,
        diameter: (this.radius - 0) * 1000,
      }
      console.log('参数---', params)
      const res = await DataList
      if (res.success) {
        this.map.clearMap()
        this.circles = res.data
        if (this.circles.length > 0) {
          await this.addCircle()
          await this.addMarker()
          await this.regeoCode()
          await this.changeShowCircle()
        }
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
      }
    },
    addMarker() {
      for (let i = 0; i < this.circles.length; i += 1) {
        let center = this.circles[i].center
        let marker = new AMap.Marker({
          position: center,
          offset: new AMap.Pixel(0, -9),
          anchor: 'center',
          title: `${this.circles[i].fullAddress}`,
          zIndex: 102
          // label: {
          //   offset: new AMap.Pixel(0, 0),
          //   content: `${i + 1}`,
          //   direction: 'top'
          // }
        })
        this.map.add(marker)
      }
    },
    // 添加Circle
    addCircle() {
      this.circleList = []
      for (let i = 0; i < this.circles.length; i += 1) {
        let center = this.circles[i].center
        let circle = new AMap.Circle({
          center: center,
          // radius: this.radius - 0,  // 半径
          radius: (this.radius - 0) * 1000 / 2,  // 半径
          strokeColor: "#F33",  // 线颜色
          // strokeColor: this.rgb(),  // 线颜色
          zIndex: 101,
          strokeOpacity: 1,  //线透明度
          strokeWeight: 3,  //线粗细度
          bubble: true, // 是否将覆盖物的鼠标或touch等事件冒泡到地图上
          fillColor: "#7c7cfb",  //填充颜色
          fillOpacity: 0.35, //填充透明度
        })
        circle.setMap(this.map)
        // this.map.add(circle)
        // this.map.setFitView()
        this.circleList.push(circle)
      }
    },
    // 逆地理编码，根据经纬度获取地址信息
    regeoCode() {
      this.addressList = []
      for (let i = 0; i < this.circles.length; i += 1) {
        let lnglat = this.circles[i].center
        let geocoder = new AMap.Geocoder({
          city: "020", //城市设为广州，默认：“全国”
          radius: (this.radius - 0) * 1000 / 2, //范围，默认：500
          // extensions: 'all'
        });
        geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            this.addressList.push(result.regeocode.formattedAddress)
          }
        });
      }
      console.log('逆地理编码---', this.addressList)
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-demo {
  position: relative;
  #container {
    width: 100%;
    height: 100%;
  }
  .input-card {
    position: absolute;
    background-color: white;
    max-height: 90%;
    // overflow-y: auto;
    top: 30px;
    left: 30px;
    padding: 10px;
    width: 400px;
    cursor: move;
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
    .concrete {
      ::v-deep.el-collapse-item__header {
        font-size: 16px;
        font-weight: bold;
      }
      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .address_content {
        font-size: 12px;
        max-height: 210px;
        overflow-y: auto;
        .info {
          line-height: 25px;
        }
      }
    }
  }
}
</style>

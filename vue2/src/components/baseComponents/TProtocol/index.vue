<template>
  <div class="t-protocolSrc">
    <t-dialog v-bind="$attrs" v-on="$listeners">
      <div class="pdf" :style="{height:protocolDialogHeight}">
        <iframe :src="protocolSrc" style="width:100%;height:100%;padding: 10px;" frameborder="0"></iframe>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import TDialog from '../TDialog'
export default {
  name: 'TProtocol',
  components: { TDialog },
  data () {
    return {
    }
  },
  props: {
    protocolDialogHeight: {
      type: String,
      default: '700px'
    },
    // 协议路径
    protocolSrc: {
      type: String
    }
  },
  methods: {
    open () {
      const checked = this.checked
      this.$emit('open', checked)
    },
    close () {
      this.$emit('update:visible', false)
    },
    handleClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>


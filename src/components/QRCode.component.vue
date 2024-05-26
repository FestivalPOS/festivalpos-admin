<template>
  <div class="mt-5">
    <h4>QR Code</h4>
    <div class="row justify-content-start">
      <div class="col-3">
        <qrcode-vue
          :value="value"
          :level="level"
          :render-as="renderAs"
          :size="200"
          :margin="1"
          id="QRCode"
        />
      </div>
      <div class="col-3">
        <button class="btn btn-primary" @click="downloadQrCode('svg')">Download as SVG</button>
        <button class="btn btn-primary mt-3" @click="downloadQrCode('png')">Download as PNG</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import QrcodeVue, { Level, RenderAs } from 'qrcode.vue'
import { toPng, toSvg } from 'html-to-image'

export default defineComponent({
  name: 'QRCodeComponent',
  props: {
    vendorPointId: {
      type: String,
      required: true
    }
  },
  components: {
    QrcodeVue
  },
  setup(props) {
    const value = ref(`${import.meta.env.VITE_API_URL}/pos/vendor-point/${props.vendorPointId}`)
    const level = ref<Level>('H')
    const renderAs = ref<RenderAs>('svg')
    const size = 200

    const downloadQrCode = (format: 'svg' | 'png') => {
      const qrCodeElement = document.getElementById('QRCode')
      const downloadName = `vendor-point-${props.vendorPointId}.${format}`

      if (qrCodeElement) {
        if (format === 'svg') {
          toSvg(qrCodeElement)
            .then((dataUrl) => {
              const link = document.createElement('a')
              link.href = dataUrl
              link.download = downloadName
              link.click()
            })
            .catch((err) => {
              console.error('Failed to download SVG', err)
            })
        } else if (format === 'png') {
          toPng(qrCodeElement)
            .then((dataUrl) => {
              const link = document.createElement('a')
              link.href = dataUrl
              link.download = downloadName
              link.click()
            })
            .catch((err) => {
              console.error('Failed to download PNG', err)
            })
        }
      }
    }

    return {
      value,
      level,
      renderAs,
      size,
      downloadQrCode
    }
  }
})
</script>

<style scoped></style>

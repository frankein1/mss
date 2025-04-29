<template>
  <div class="camera-button">
    <div
      v-if="isCameraOpen"
      class="camera-box"
    >
      <button
        type="button"
        class="fr-btn"
        @click="takePhoto"
      >
        Prendre une photo
      </button>
      <video
        v-show="!isPhotoTaken"
        ref="camera"
        :width="canvasWidth"
        :height="canvasWidth"
        autoplay
      ></video>
      <canvas
        v-show="isPhotoTaken"
        id="photoTaken"
        ref="canvas"
        :width="canvasWidth"
        :height="canvasWidth"
      ></canvas>
    </div>
    <button
      type="button"
      class="fr-btn"
      :class="{ 'is-primary': !isCameraOpen, 'is-danger': isCameraOpen }"
      @click="toggleCamera"
    >
      <span v-if="!isCameraOpen">Open Camera</span>
      <span v-else>Close Camera</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  const isCameraOpen = ref<boolean>(false)
  const isPhotoTaken = ref<boolean>(false)
  const camera = ref<HTMLVideoElement | null>(null)
  const canvas = ref<HTMLCanvasElement | null>(null)
  const canvasWidth = ref<number>(450)

  const toggleCamera = () => {
    if (isCameraOpen.value) {
      isCameraOpen.value = false
      isPhotoTaken.value = false
      stopCameraStream()
    } else {
      isCameraOpen.value = true
      createCameraElement()
    }
  }

  const createCameraElement = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true
      })
      .then(stream => {
        if (camera.value != null) {
          camera.value.srcObject = stream
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  const stopCameraStream = () => {
    if (camera.value?.srcObject != null) {
      const tracks = (camera.value.srcObject as MediaStream).getTracks()
      tracks.forEach((track: MediaStreamTrack) => {
        track.stop()
      })
    }
  }

  const takePhoto = () => {
    if (canvas.value == null) {
      return
    }
    isPhotoTaken.value = !isPhotoTaken.value
    const context = canvas.value.getContext('2d')
    if (context == null) {
      return
    }
    const canvasImageSource = camera.value
    if (canvasImageSource == null) {
      return
    }
    context.drawImage(
      canvasImageSource,
      0,
      0,
      canvasWidth.value,
      canvasWidth.value
    )
    const data = canvas.value.toDataURL('image/jpeg')
    console.log(data)
  }
</script>

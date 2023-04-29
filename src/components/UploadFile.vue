<template>
  <div>
    <form @submit.prevent="uploadFile">
      <input type="file" ref="fileInput" @change="setFile">
      <button type="submit">Upload</button>
    </form>

    <div class="progress-container" v-if="progress > 0">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      <div class="progress-label">{{ progress }}%</div>
    </div>

  </div>
</template>

<script>
const URL = process.env.VUE_APP_URL;

export default {
  data() {
    return {
      file: null,
      progress: 0,
      directUploadUrl: null,
      directUploadHeaders: {}
    };
  },
  methods: {
    async getDirectUploadUrl() {
      const response = await fetch(`${URL}/rails/active_storage/direct_uploads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: this.file.name,
          content_type: this.file.type,
          byte_size: this.file.size,
          checksum: "rrz0clNvIgdstM/NveTsoQ=="
        })
      });
      const data = await response.json();
      this.directUploadUrl = data.direct_upload_url;
      this.directUploadHeaders = data.headers;
    },
    setFile(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      await this.getDirectUploadUrl();
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', this.directUploadUrl, true);
      xhr.setRequestHeader('Content-Type', this.file.type);
      Object.entries(this.directUploadHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      xhr.upload.onprogress = (event) => {
        this.progress = Math.round((event.loaded / event.total) * 100);
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 204) {
            console.log('Upload concluído');
          } else {
            console.error('Erro ao fazer upload');
          }
        }
      };
      xhr.send(this.file);
    }
  }
};
</script>

<style>
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.progress-container {
  width: 100%;
  height: 20px;
  border: 1px solid #ccc;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.progress-bar {
  height: 100%;
  background-color: #2196f3;
}

.progress-label {
  margin-left: 10px;
}
</style>
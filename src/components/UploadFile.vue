<template>
  <div>
    <form @submit.prevent="uploadFile">
      <input
        ref="fileInput"
        type="file"
        class="input"
        @change="setFile"
      >
      <button
        class="button is-link"
        type="submit"
      >
        Upload
      </button>
    </form>

    <div
      v-if="progress > 0"
      class="progress-container"
    >
      <div
        class="progress-bar"
        :style="{ width: `${progress}%` }"
      />
      <div class="progress-label">
        {{ progress }}%
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, defineEmits } from 'vue';
  import CryptoJS from 'crypto-js'; // yarn add crypto-js

  const URL = process.env.VUE_APP_URL;

  const emit = defineEmits(['onSignedId']);

  const file                = ref(null);
  const progress            = ref(0);
  const directUploadUrl     = ref(null);
  const directUploadHeaders = ref({});
  const signedId            = ref(null);

  async function uploadFile() {
    await getDirectUploadUrl();

    fetch(directUploadUrl.value, {
      method: 'PUT',
      headers: {
        'Content-Type': file.value.type,
        ...directUploadHeaders.value
      },
      body: file.value
    }).then(response => {
      if (response.ok) {
        console.log('Upload completed. Sign ID: ', signedId.value);
      } else {
        console.error('Error loading');
      }
    }).catch(error => {
      console.error('Error loading', error);
    });
  }

  async function getDirectUploadUrl() {
    const checksum = await getBlobChecksum();
    const response = await fetch(`${URL}/rails/active_storage/direct_uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blob: {
          filename:     file.value.name,
          content_type: file.value.type,
          byte_size:    file.value.size,
          checksum:     checksum
        }
      })
    });

    const data                = await response.json();
    directUploadUrl.value     = data.direct_upload_url;
    directUploadHeaders.value = data.headers;
    signedId.value            = data.signed_id;

    emit('onSignedId', signedId.value);
  }

  function setFile(event) {
    file.value = event.target.files[0];

    // Para enviar o arquivo logo após selecioná-lo:
    // this.uploadFile();
  }

  function getBlobChecksum() {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const wordArray = CryptoJS.lib.WordArray.create(event.target.result);
        const checksum  = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Base64);

        resolve(checksum);
      };

      fileReader.onerror = (event) => {
        reject(event.target.error);
      };

      fileReader.readAsArrayBuffer(file.value);
    });
  }
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

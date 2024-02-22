<template>
  <div class="container">
    <form
      class="box"
      @submit.prevent="uploadFile"
    >
      <div class="field">
        <label
          for="file"
          class="label"
        >Foto do veículo</label>
        <div class="control">
          <input
            id="file"
            ref="fileInput"
            type="file"
            class="input"
            @change="setFile"
          >
        </div>

        <!-- Adicionando o elemento <img> para mostrar o preview da imagem -->
        <img
          v-if="file && filePreview"
          :src="filePreview"
          alt="Preview"
          style="max-width: 100%; max-height: 100px; margin-top: 80px;"
        >

        <div
          v-if="progress > 0"
          class="progress-container progress is-primary"
          style="width: 100%; height: 20px; margin-top: 10px;"
        >
          <progress
            class="progress-bar"
            :value="progress"
            max="100"
            style="width: 100%; height: 100%;"
          >
            {{ progress }}%
          </progress>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button
            class="button is-info is-light is-small"
            type="submit"
          >
            Upload
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import CryptoJS from 'crypto-js'; // yarn add crypto-js

  const URL = process.env.VUE_APP_URL;

  const emit = defineEmits(['onSignedId']);

  const file                = ref(null);
  const filePreview         = ref(null); // Referência para o preview da imagem
  const progress            = ref(0);
  const directUploadUrl     = ref(null);
  const directUploadHeaders = ref({});
  const signedId            = ref(null);

  // Envia o arquivo para o servidor
  async function uploadFile() {
    await getDirectUploadUrl();

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': file.value.type,
        ...directUploadHeaders
      }
    };

    // Cria um novo objeto XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Define a função a ser chamada quando houver uma atualização de progresso
    xhr.upload.onprogress = (event) => {
      progress.value = Math.round((event.loaded / event.total) * 100);
    };

    // Define a função a ser chamada após o upload ser concluído
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 204) {
          console.log("Upload completed. Sign ID: ", signedId.value);
        } else {
          console.error("Error loading");
        }
      }
    };

    // Abre uma conexão com o servidor e envia a requisição
    xhr.open('PUT', directUploadUrl.value, true);
    for (const [key, value] of Object.entries(requestOptions.headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.send(file.value);
  }

  // Obtém a URL para upload do arquivo
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
    // uploadFile();

    // Atualiza o preview da imagem
    if (file.value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        filePreview.value = e.target.result;
      };
      reader.readAsDataURL(file.value);
    }
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

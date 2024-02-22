<template>
  <table class="table is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th>Placa</th>
        <th>Reservas</th>
        <th>Controle</th>
        <th>Foto do Veículo</th>
      </tr>
    </thead>
    <tbody
      v-for="car in props.list"
      :key="car.id"
    >
      <tr>
        <td>{{ car.plate }}</td>
        <td>
          <button
            class="button is-link is-light"
            @click="() => emit('onShowCarInfo', (car.plate))"
          >
            Ver reservas
          </button>
        </td>
        <td>
          <button
            class="button is-danger is-light"
            @click="showModal(car.plate)"
          >
            Remover
          </button>
        </td>
        <td>
          <img
            :src="car.photo_url ? car.photo_url : 'placeholder.jpg'"
            alt="Foto do veículo"
            style="max-width: 100px; max-height: 50px;"
          >
        </td>
      </tr>
    </tbody>
  </table>

  <ModalConfirmation
    :show-modal-flag="showModalFlag"
    :plate="currentPlate"
    @on-ok-modal="okModal"
    @on-cancel-modal="cancelModal"
  />
</template>

<script setup>
  import { ref } from "vue";
  import { toast } from "bulma-toast";
  import ModalConfirmation from "./ModalConfirmation.vue";

  const URL = process.env.VUE_APP_URL;

  const props = defineProps({
    list: {
      type: Array,
      required: true,
    },
  })

  const showModalFlag = ref(false);
  const currentPlate  = ref("");

  async function deleteCar(plate) {
    const response = await fetch(`${URL}/parking/${plate}`, {
      method: "DELETE",
    });

    toast({
      message: "Veículo removido com sucesso",
      type: "is-success",
      dismissible: true,
      duration: 5000
    });

    emit("onGetCarList");
  }

  function showModal(plate) {
    showModalFlag.value = true;

    currentPlate.value = plate;
  }

  function okModal(plate) {
    showModalFlag.value = false;

    deleteCar(plate);
  }

  function cancelModal() {
    showModalFlag.value = false;
  }

  const emit = defineEmits(['onShowCarInfo', 'onGetCarList'])
</script>

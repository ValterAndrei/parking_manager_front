<template>
  <table class="table is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th>Placa</th>
        <th>Reservas</th>
        <th>Controle</th>
      </tr>
    </thead>
    <tbody
      v-for="car in props.list"
      :key="car.id"
    >
      <ModalConfirmation
        :show-modal-flag="showModalFlag"
        :plate="car.plate"
        @on-ok-modal="okModal"
        @on-cancel-modal="cancelModal"
      />

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
      </tr>
    </tbody>
  </table>
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
  const okPressed     = ref(false);

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
    okPressed.value = false;
    showModalFlag.value = true;
  }

  function okModal(plate) {
    okPressed.value = true;
    showModalFlag.value = false;

    deleteCar(plate);
  }

  function cancelModal() {
    okPressed.value = false;
    showModalFlag.value = false;

    toast({
      message: "Operação cancelada",
      type: "is-danger",
      dismissible: true,
      duration: 5000
    });
  }

  const emit = defineEmits(['onShowCarInfo', 'onGetCarList'])
</script>

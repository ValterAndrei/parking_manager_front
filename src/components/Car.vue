<template>
  <table class="table is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th>Placa</th>
        <th>Reservas</th>
      </tr>
    </thead>
    <tbody v-for="car in props.list" :key="car.id">
      <tr>
        <td>{{ car.plate }}</td>
        <td>
          <button class="button is-link is-light" @click="showCar(car.plate)">
            Ver reservas
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { defineProps, defineEmits } from "vue";

  const props = defineProps(['list'])

  // https://stackoverflow.com/a/69834633/7346892
  const emit = defineEmits(['onShowCarInfo'])

  function showCar(params) {
    emit('onShowCarInfo', params)
  }
</script>

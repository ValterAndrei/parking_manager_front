<template>
  <div class="table-container">
    <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Saída</th>
        </tr>
      </thead>
      <tbody v-for="car in carList" :key="car.id">
        <tr>
          <td>{{ car.plate }}</td>
          <td>
            <button class="button is-link is-light" @click="getCar(car.plate)">
              Ver reservas
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Entrada</th>
        </tr>
      </thead>
      <tbody v-for="(info, index) in carInfo.reservations" :key="index">
        <tr>
          <td>{{ info.code }}</td>
          <td>{{ info.created_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const URL = process.env.VUE_APP_URL;
  const carList = ref([]);
  const carInfo = ref({});

  async function getCarList() {
    const response = await fetch(`${URL}`);
    const data = await response.json();

    carList.value = data;
  }

  async function getCar(plate) {
    const response = await fetch(`${URL}/parking/${plate}`);
    const data = await response.json();

    carInfo.value = data;
  }

  getCarList();
</script>

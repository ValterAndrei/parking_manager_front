<template>
  <ol v-for="car in carList" :key="car.id">
    <ul>{{ car.plate }} <button @click="getCar(car.plate)">Ver reservas</button></ul>
  </ol>
  <div>
    <ol v-for="(info, index) in carInfo.reservations" :key="index">
      <li>Código: {{info.code}}</li>
      <li>Tempo: {{info.time}}</li>
    </ol>
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

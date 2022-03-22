<template>
  <section class="section">
    <div class="container">
      <div class="field">
        <label class="label">Placa</label>
        <div class="control">
          <input class="input" type="text" placeholder="e.g BQT-9377" v-model="plate" />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" @click="checkin()">Submit</button>
        </div>
      </div>

      <div class="table-container">
        <table class="table is-bordered is-striped is-hoverable">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Reservas</th>
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
        <!-- <Reservation :list="carInfo.reservations"/> -->

        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Entrada</th>
              <th>Controle</th>
            </tr>
          </thead>
          <tbody v-for="(reservation, index) in carInfo.reservations" :key="index">
            <tr>
              <td>{{ reservation.code }}</td>
              <td>{{ reservation.created_at }}</td>
              <td>
                <button
                  v-if="!reservation.paid"
                  class="button is-link is-light"
                  @click="payment(reservation)"
                >
                  Pagar
                </button>
                <button
                  v-else-if="reservation.paid && !reservation.left"
                  class="button is-link is-light"
                  @click="checkout(reservation)"
                >
                  Checkout
                </button>
                <span v-else>Finalizado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
// import Reservation from "./Reservation.vue"

const URL = process.env.VUE_APP_URL;
const carList = ref([]);
const carInfo = ref({});
const plate = ref("");

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

async function checkin() {
  await fetch(`${URL}/parking/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicle: { plate: plate.value } }),
  });

  getCarList();
}

async function payment({ code, plate }) {
  await fetch(`${URL}/parking/${code}/pay`, { method: "PUT" });

  getCar(plate);
}

async function checkout({ code, plate }) {
  await fetch(`${URL}/parking/${code}/out`, { method: "PUT" });

  getCar(plate);
}

getCarList();
</script>

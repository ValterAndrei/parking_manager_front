<template>
  <section class="section">
    <div class="container">
      <div class="field">
        <label class="label">Placa</label>
        <div class="control">
          <input
            ref="plate_input"
            v-model="plate"
            class="input"
            type="text"
            placeholder="e.g BQT-9377"
          >
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            class="button is-link"
            @click="checkin()"
          >
            Submit
          </button>
        </div>
      </div>

      <div class="table-container">
        <Car
          :list="carList"
          @on-show-car-info="getCar"
        />
      </div>

      <div class="table-container">
        <!-- <Reservation :list="carInfo.reservations" /> -->

        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Entrada</th>
              <th>Controle</th>
            </tr>
          </thead>
          <tbody
            v-for="(reservation, index) in carInfo.reservations"
            :key="index"
          >
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
import Car from "./Car.vue"
// import Reservation from "./Reservation.vue"

const URL = process.env.VUE_APP_URL;
const carList = ref([]);
const carInfo = ref({});
const plate = ref("");
const plate_input = ref(null);

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
  // https://jasonwatmore.com/post/2020/04/30/vue-fetch-http-post-request-examples

  await fetch(`${URL}/parking/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicle: { plate: plate.value } }),
  });

  plate_input.value.focus();

  getCarList();
}

async function payment({ code }) {
  await fetch(`${URL}/parking/${code}/pay`, { method: "PUT" });
}

async function checkout({ code }) {
  await fetch(`${URL}/parking/${code}/out`, { method: "PUT" });
}

getCarList();
</script>

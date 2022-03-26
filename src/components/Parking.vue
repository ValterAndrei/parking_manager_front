<template>
  <section class="section">
    <div class="container">
      <div class="columns is-desktop">
        <div class="column is-one-fifth">
          <div class="field">
            <label class="label">Placa</label>
            <div class="control">
              <input
                ref="plate_input"
                v-model="plate"
                v-maska="{ mask: 'HHH-NNNN', tokens: { 'H': { pattern: /[a-fA-F]/, uppercase: true }, 'N': { pattern: /[0-9]/ } }}"
                class="input"
                type="text"
                placeholder="e.g BQT-9377"
              >
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button
                class="button is-link"
                @click="checkin()"
              >
                Registrar entrada
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="table-container">
            <Car
              :list="carList"
              @on-show-car-info="getCar"
            />
          </div>
        </div>
        <div class="column">
          <div class="table-container">
            <Reservation
              :list="reservationsList"
              @make-payment="payment"
              @make-checkout="checkout"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import Car from "./Car.vue";
import Reservation from "./Reservation.vue";

const URL = process.env.VUE_APP_URL;

const carList          = ref([]);
const reservationsList = ref([]);
const plate            = ref("");
const plate_input      = ref(null);

async function getCarList() {
  const response = await fetch(`${URL}`);
  const data     = await response.json();

  carList.value = data;
}

async function getCar(plate) {
  const response = await fetch(`${URL}/parking/${plate}`);
  const data     = await response.json();

  reservationsList.value = data.reservations;
}

async function checkin() {
  await fetch(`${URL}/parking/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicle: { plate: plate.value } }),
  });

  plate_input.value.focus();
  plate.value = "";

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

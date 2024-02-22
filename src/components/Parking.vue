<template>
  <section class="section">
    <div class="container">
      <div class="columns is-desktop">
        <div class="column is-half">
          <div class="field">
            <label class="label">Placa do veículo</label>
            <div class="control">
              <input
                ref="plate_input"
                v-model="plate"
                v-maska="{
                  mask: 'LLL-NDNN',
                  tokens: {
                    'L': { pattern: /[a-zA-Z]/, uppercase: true },
                    'N': { pattern: /[0-9]/ },
                    'D': { pattern: /[a-zA-Z0-9]/, uppercase: true }
                  }
                }"
                class="input"
                type="text"
                placeholder="e.g BQT-9377"
                @keyup.enter="checkin()"
              >
            </div>
          </div>

          <div class="field">
            <div class="control">
              <UploadFile
                ref="clearChildData"
                @on-signed-id="setSignedId"
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button
                class="button is-link"
                :class="{'is-loading': isLoading}"
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
              @on-get-car-list="getCarList"
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
  import { ref, onMounted } from 'vue';
  import { toast } from 'bulma-toast';

  import Car from './Car.vue';
  import Reservation from './Reservation.vue';
  import UploadFile from './UploadFile.vue';

  const URL = process.env.VUE_APP_URL;

  const carList          = ref([]);
  const reservationsList = ref([]);
  const plate            = ref("");
  const plate_input      = ref(null);
  const isLoading        = ref(false);
  const signedId         = ref(null);
  const clearChildData   = ref(null);

  async function getCarList() {
    const response = await fetch(`${URL}`);
    const data     = await response.json();

    reservationsList.value = [] // Limpa lista de reservas.
    carList.value = data;
  }

  async function getCar(plate) {
    const response = await fetch(`${URL}/parking/${plate}`);
    const data     = await response.json();

    reservationsList.value = data.reservations;
  }

  async function checkin() {
    if (plate.value === "" || plate.value.length !== 8) {
      toast({
        message: "Por favor, informe a placa do veículo",
        type: "is-danger",
        dismissible: true,
        duration: 5000
      });

      return;
    }

    isLoading.value = true;

    try {
      const response = await fetch(`${URL}/parking/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            vehicle: {
              plate: plate.value,
              photo: signedId.value
            }
          }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          message: `HTTP error ${response.status}: ${data[0]}`,
          type: "is-danger",
          dismissible: true,
          duration: 5000
        });
      } else {
        toast({
          message: "Veículo registrado com sucesso",
          type: "is-success",
          dismissible: true,
          duration: 5000
        });

        plate_input.value.focus();
        plate.value = "";
        clearChildData.value.clearFields(); // Limpa dos dados do componente de Upload.
        getCarList();
      }
    }
    catch(error) {
      toast({
        message: `Não foi possível registrar esta reserva: ${error}`,
        type: "is-danger",
        dismissible: true,
        duration: 5000
      });
    }

    isLoading.value = false;
  }

  async function payment({ code, plate }) {
    await fetch(`${URL}/parking/${code}/pay`, { method: "PUT" });

    toast({ message: 'Pagamento efetuado' })
    getCar(plate);
  }

  async function checkout({ code, plate }) {
    await fetch(`${URL}/parking/${code}/out`, { method: "PUT" });

    toast({ message: 'Saída concluída' })
    getCar(plate);
  }

  function setSignedId(signedIdParam) {
    signedId.value = signedIdParam;
  }

  onMounted(() => {
    getCarList();
  })
</script>

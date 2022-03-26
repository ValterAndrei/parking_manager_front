<template>  
  <table class="table">
    <thead>
      <tr>
        <th>Código</th>
        <th>Entrada</th>
        <th>Saída</th>
        <th>Controle</th>
      </tr>
    </thead>
    <tbody
      v-for="(reservation, index) in list"
      :key="index"
    >
      <tr>
        <td>{{ reservation.code }}</td>
        <td>{{ reservation.created_at }}</td>
        <td>{{ reservation.checkout }}</td>
        <td>
          <button
            v-if="!reservation.paid"
            class="button is-link is-light"
            @click="() => emit('makePayment', (reservation))"
          >
            Pagar
          </button>
          <button
            v-else-if="reservation.paid && !reservation.left"
            class="button is-link is-light"
            @click="() => emit('makeCheckout', (reservation))"
          >
            Checkout
          </button>
          <span v-else>Finalizado</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  const props = defineProps({
    list: {
      type: Array,
      required: true,
    },
  })

  const emit = defineEmits([
    'makePayment',
    'makeCheckout',
  ])
</script>

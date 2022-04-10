<template>  
  <table class="table is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th>Código</th>
        <th>Entrada</th>
        <th>Saída</th>
        <th>Tempo</th>
        <th>Controle</th>
      </tr>
    </thead>
    <tbody
      v-for="(reservation, index) in list"
      :key="index"
    >
      <tr>
        <td>{{ reservation.code }}</td>
        <td>{{ formatDate(reservation.created_at) }}</td>
        <td>{{ formatDate(reservation.checkout) }}</td>
        <td>{{ reservation.time }}</td>
        <td>
          <button
            v-if="!reservation.paid"
            class="button is-success is-light"
            @click="() => emit('makePayment', (reservation))"
          >
            Pagar
          </button>
          <button
            v-else-if="reservation.paid && !reservation.left"
            class="button is-primary is-light"
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

  function formatDate(date) {
    return date
      ? new Date(date).toLocaleString('pt-BR')
      : '-'
  }
</script>

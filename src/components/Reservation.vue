<template>  
  <table class="table">
    <thead>
      <tr>
        <th>Código</th>
        <th>Entrada</th>
        <th>Saída</th>
        <!-- <th>Tempo</th> -->
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
        <!-- <td>{{ relativeTime(reservation) }}</td> -->
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

  function formatDate(date) {
    return date
      ? new Date(date).toLocaleString('pt-BR')
      : '-'
  }

  // function relativeTime(reservation) {
  //   const now = new Date()
  //   const diff = now - new Date(reservation.created_at)
  //   const seconds = Math.floor(diff / 1000)
  //   const minutes = Math.floor(seconds / 60)
  //   const hours = Math.floor(minutes / 60)
  //   const days = Math.floor(hours / 24)

  //   if (days > 0) {
  //     return `${days} dia(s)`
  //   } else if (hours > 0) {
  //     return `${hours} hora(s)`
  //   } else if (minutes > 0) {
  //     return `${minutes} minuto(s)`
  //   } else {
  //     return `${seconds} segundo(s)`
  //   }
  // }

</script>

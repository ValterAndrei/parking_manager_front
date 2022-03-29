<template>
  <table class="table is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th>Placa</th>
        <th>Reservas</th>
        <th>Controle</th>
      </tr>
    </thead>
    <tbody
      v-for="car in props.list"
      :key="car.id"
    >
      <tr>
        <td>{{ car.plate }}</td>
        <td>
          <button
            class="button is-link is-light"
            @click="() => emit('onShowCarInfo', (car.plate))"
          >
            Ver reservas
          </button>
        </td>
        <td>
          <button
            class="button is-danger is-light"
            @click="() => emit('onDeleteCar', (car.plate))"
          >
            Remover
          </button>
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

  const emit = defineEmits(['onShowCarInfo', 'onDeleteCar'])
</script>

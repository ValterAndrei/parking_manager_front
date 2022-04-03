<template>
  <div
    class="modal"
    :class="{'is-active': showModalFlag}"
  >
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Confirmação
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="() => emit('onCancelModal')"
        />
      </header>
      <section class="modal-card-body">
        <p>Deseja remover este veículo: {{ plate }}?</p>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-success"
          @click="() => emit('onOkModal', plate)"
        >
          Ok
        </button>
        <button
          class="button"
          @click="() => emit('onCancelModal')"
        >
          Cancelar
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    showModalFlag: {
      type: Boolean,
      required: true,
    },
    plate: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(['onOkModal', 'onCancelModal'])
</script>

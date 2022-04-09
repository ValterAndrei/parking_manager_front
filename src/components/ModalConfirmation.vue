<template>
  <div
    class="modal"
    :class="{'is-active': showModalFlag}"
  >
    <!-- XXX: Fechando modal quando clica fora dele -->
    <div
      class="modal-background"
      @click="$emit('onCancelModal')"
    />
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
  import { onMounted } from "vue";

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

  onMounted(() => {
    document.addEventListener("keydown", (e) => {
      // If  ESC key was pressed...
      if (e.key === 'Escape') {
        emit('onCancelModal')
      }
    });
  })

  const emit = defineEmits(['onOkModal', 'onCancelModal'])
</script>

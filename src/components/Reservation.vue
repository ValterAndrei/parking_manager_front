<template>
  {{props.list}}
</template>

<script setup>
  // eslint-disable-next-line
  const props = defineProps(['list'])
  console.log(props.list)
</script>

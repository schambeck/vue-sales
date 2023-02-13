<template>
  <panel header="Orders" class="shadow-4">
    <ListOrder />
  </panel>
</template>

<script>
import ListOrder from "@/components/ListOrder.vue";

export default {
  name: "ListOrderView",
  components: { ListOrder },
};
</script>

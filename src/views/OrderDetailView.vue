<template>
  <panel header="Order" class="shadow-4">
    <OrderDetail />
  </panel>
</template>

<script>
import OrderDetail from "@/components/OrderDetail.vue";

export default {
  name: "OrderDetailView",
  components: { OrderDetail },
};
</script>

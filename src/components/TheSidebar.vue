<template>
  <div>
    <Menu :model="items" class="shadow-4" />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const menu = ref();
    const items = ref([
      {
        label: "General",
        items: [
          {
            label: "Home",
            icon: "pi pi-home",
            to: "/",
          },
          {
            label: "Profile",
            icon: "pi pi-user",
            to: "/profile",
          },
        ],
      },
      {
        label: "Sales",
        items: [
          {
            label: "Orders",
            icon: "pi pi-shopping-cart",
            to: "/list-order",
          },
        ],
      },
    ]);

    return { items, menu };
  },
};
</script>

<style scoped>
::v-deep(.p-menu) {
  border-radius: 12px !important;
}
::v-deep(.p-menu ul) {
  margin: 2px !important;
}
</style>

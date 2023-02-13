<script setup lang="ts">
import { RouterView } from "vue-router";
import TheSidebar from "@/components/TheSidebar.vue";
import TheHeader from "@/components/TheHeader.vue";
import Toast from "primevue/toast";
</script>

<template>
  <Toast />
  <div class="grid" style="width: 100vw">
    <div class="col-12 p-0 shadow-4"><the-header></the-header></div>
    <div class="col-12 lg:p-4">
      <div class="flex">
        <div class="flex-none hidden lg:inline-flex lg:pr-4">
          <the-sidebar></the-sidebar>
        </div>
        <div class="flex-grow-1">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useCreateOrderApi,
  useFindByIdOrderApi,
  useUpdateOrderApi,
} from "@/service/order.api";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const createApi = useCreateOrderApi();
const updateApi = useUpdateOrderApi();
const findByIdApi = useFindByIdOrderApi();
const order = ref();

const processing = computed(() => {
  return (
    createApi.processing.value ||
    updateApi.processing.value ||
    findByIdApi.processing.value
  );
});

const saving = computed(() => {
  return createApi.processing.value || updateApi.processing.value;
});

onMounted(() => {
  if (route.params.id === "") {
    order.value = {};
  } else {
    const id = parseInt(route.params.id.toString());
    findByIdApi.doFetch(id).then(() => (order.value = findByIdApi.order.value));
  }
});

function newOrder() {
  order.value = {};
}

function save() {
  if (order.value) {
    if (order.value.id) {
      const id = parseInt(route.params.id.toString());
      updateApi.doFetch(id, order.value).then(() => {
        if (updateApi.error.value == null) {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: `Order updated: ${updateApi.order.value?.id}`,
            life: 3000,
          });
          router.push({ name: "list-order" });
          order.value = updateApi.order.value;
        }
        return order.value;
      });
    } else {
      createApi.doFetch(order.value).then(() => {
        if (createApi.error.value == null) {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: `Order created: ${createApi.order.value?.id}`,
            life: 3000,
          });
          router.push({ name: "list-order" });
          order.value = createApi.order.value;
        }
        return order.value;
      });
    }
  }
}
</script>

<style scoped>
::v-deep(.p-card-body) {
  padding: 1rem;
}
::v-deep(.p-card-content) {
  padding: 0;
}
::v-deep(.p-toolbar .p-button) {
  margin: 0.2rem;
}
</style>

<template>
  <Card>
    <template #header>
      <Toolbar>
        <template #start>
          <router-link to="/list-order" custom v-slot="{ navigate }">
            <Button
              v-tooltip="'Back to the order list'"
              label="Back"
              icon="pi pi-arrow-left"
              class="p-button-secondary p-button-raised mr-2"
              role="link"
              @click="navigate"
            />
          </router-link>
          <Button
            label="New"
            icon="pi pi-plus"
            class="p-button-success p-button-raised mr-2"
            :disabled="processing"
            @click="newOrder()"
          />
          <Button
            label="Save"
            icon="pi pi-save"
            class="p-button-raised mr-2"
            :disabled="findByIdApi.processing.value"
            :loading="saving"
            @click="save()"
          />
        </template>
      </Toolbar>
    </template>
    <template #content>
      <div v-if="createApi.error.value">
        <div v-if="Array.isArray(createApi.error.value.message)">
          <Message
            severity="error"
            v-for="message in createApi.error.value.message"
            :key="message"
          >
            {{ message }}
          </Message>
        </div>
        <Message severity="error" v-else>
          <p>{{ createApi.error.value.message }}</p>
        </Message>
      </div>
      <div v-else-if="findByIdApi.processing.value">
        <div class="field">
          <label for="id">Id</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="issuedDate">Issued</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="product">Product</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="total">Total</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
      </div>
      <div v-if="order" v-focus-trap>
        <div class="field">
          <label for="id" class="w-full">Id</label>
          <InputNumber input-id="id" v-model="order.id" disabled />
        </div>
        <div class="field">
          <label for="issuedDate" class="w-full">Issued</label>
          <Calendar
            inputId="issuedDate"
            v-model="order.issuedDate"
            :manual-input="false"
            date-format="yy-mm-dd"
            autofocus
          />
        </div>
        <div class="field">
          <label for="product">Product</label>
          <InputText
            id="product"
            type="text"
            v-model="order.product"
            class="w-full"
          />
        </div>
        <div class="field" style="margin-bottom: 0">
          <label for="total" class="w-full">Total</label>
          <InputNumber
            input-id="total"
            v-model="order.total"
            mode="decimal"
            locale="pt-BR"
            :minFractionDigits="2"
            :maxFractionDigits="2"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

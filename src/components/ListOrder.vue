<script setup lang="ts">
import { useFindPageOrderApi, useRemoveOrderApi } from "@/service/order.api";
import { useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import moment from "moment/moment";

const route = useRouter();
const toast = useToast();
const findPageApi = useFindPageOrderApi();
const removeApi = useRemoveOrderApi();
const fakeOrders = [{}, {}, {}, {}, {}];
const search = ref("");

onMounted(() => {
  findPageApi.doFetch(1, 5, "");
});

function rowClick(event: any) {
  route.push({ name: "order-detail", params: { id: event.data.id } });
}

function removeOrder(id: number) {
  removeApi.doFetch(id).then(() => {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Order removed: ${id}`,
      life: 3000,
    });
    refresh();
  });
}

function isRemoving(id: number) {
  return removeApi.isRemoving(id);
}

function refresh() {
  findPageApi.doFetch(
    findPageApi.page.value?.meta.currentPage,
    findPageApi.page.value?.meta.itemsPerPage,
    search.value
  );
}

async function doSearch() {
  await findPageApi.doFetch(1, 5, search.value);
}

watch(search, doSearch);

function newOrder() {
  route.push({ name: "order-detail", params: { id: null } });
}

const formatDecimal = (value: string) => {
  if (value)
    return parseFloat(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
};

const formatDate = (value: string) => {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY");
  }
};

function onPage(event: any) {
  findPageApi.doFetch(event.page + 1, event.rows, search.value);
}
</script>

<style scoped>
::v-deep(.p-card-body) {
  padding: 0;
}
::v-deep(.p-card-content) {
  padding: 0;
}
::v-deep(.p-paginator) {
  background-color: unset;
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
          <Button
            label="New"
            icon="pi pi-plus"
            class="p-button-success p-button-raised mr-2"
            @click="newOrder()"
          />
        </template>
        <template #end>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="search"
              placeholder="Search"
              class="shadow-1 mr-2"
            />
          </span>
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            class="p-button-raised"
            :loading="false"
            @click="refresh()"
          />
        </template>
      </Toolbar>
    </template>
    <template #content>
      <div v-if="findPageApi.error.value">
        <p>Oops! Error encountered: {{ findPageApi.error.value?.message }}</p>
      </div>
      <div v-else-if="findPageApi.processing.value">
        <DataTable
          show-gridlines
          striped-rows
          :value="fakeOrders"
          :rowHover="true"
          @row-click="rowClick($event)"
        >
          <Column
            field="id"
            header="Id"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="issuedDate"
            header="Issued"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="product"
            header="Product"
            headerStyle="width: 60%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="total"
            header="Total"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            header="Actions"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
        </DataTable>
      </div>
      <div v-else-if="findPageApi.page.value?.data">
        <DataTable
          show-gridlines
          striped-rows
          :value="findPageApi.page.value.data"
          :rowHover="true"
          @row-click="rowClick($event)"
        >
          <Column
            field="id"
            header="Id"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: right"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.id }}
              </div>
            </template>
          </Column>
          <Column
            field="issuedDate"
            header="Issued"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: center"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ formatDate(slotProps.data.issuedDate) }}
              </div>
            </template>
          </Column>
          <Column
            field="product"
            header="Product"
            headerStyle="width: 60%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.product }}
              </div>
            </template>
          </Column>
          <Column
            field="total"
            header="Total"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: right"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ formatDecimal(slotProps.data.total) }}
              </div>
            </template>
          </Column>
          <Column
            header="Actions"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div style="text-align: center">
                <Button
                  icon="pi pi-trash"
                  class="p-button-danger p-button-text p-button-sm p-0"
                  v-tooltip.left="'Remove'"
                  :loading="isRemoving(slotProps.data.id)"
                  @click="removeOrder(slotProps.data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      <Paginator
        :rows="findPageApi.page.value?.meta.itemsPerPage"
        :totalRecords="findPageApi.page.value?.meta.totalItems"
        :rowsPerPageOptions="[5, 10, 20, 30]"
        @page="onPage($event)"
      />
    </template>
  </Card>
</template>

import type { Paginated } from "@/pagination/paginated";
import type { Ref } from "vue";
import { ref } from "vue";

export class BaseCreate<T> {
  constructor(public apiUrl: string) {}
  order = ref<T>();
  error = ref<any>();
  processing = ref(false);

  async doFetch(order: T) {
    this.error.value = undefined;
    this.processing.value = true;

    const res = await fetch(`${this.apiUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const response = await res.json();
    if (res.ok) {
      this.order.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }
}

export class BaseUpdate<T, ID> {
  constructor(public apiUrl: string) {}
  order = ref<T>();
  error = ref<any>();
  processing = ref(false);

  async doFetch(id: ID, order: T) {
    this.error.value = undefined;
    this.processing.value = true;

    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const response = await res.json();
    if (res.ok) {
      this.order.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }
}

export class BaseFindById<T, ID> {
  constructor(public apiUrl: string) {}
  order = ref<T>();
  error = ref<any>();
  processing = ref(false);

  async doFetch(id: ID) {
    this.error.value = undefined;
    this.processing.value = true;

    const res = await fetch(`${this.apiUrl}/${id}`);
    const response = await res.json();
    if (res.ok) {
      this.order.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }
}

export class BaseFindPage<T> {
  constructor(public apiUrl: string) {}
  page = ref<Paginated<T>>() as Ref<Paginated<T>>;
  error = ref<any>();
  processing = ref(false);

  async doFetch(pageNumber: number, limit: number, search: string) {
    this.error.value = undefined;
    this.processing.value = true;

    const res = await fetch(this.getUrl(pageNumber, limit, search));
    const response = await res.json();
    if (res.ok) {
      this.page.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }

  getUrl(pageNumber: number, limit: number, search: string) {
    const params = new URLSearchParams({
      page: pageNumber.toString(),
      limit: limit.toString(),
      search: search,
    });
    return `${this.apiUrl}?${params.toString()}`;
  }
}

export class BaseRemove<ID> {
  constructor(public apiUrl: string) {}
  error = ref<any>();
  processing = ref(false);
  removing = ref<ID[]>([]) as Ref<ID[]>;

  async doFetch(id: ID) {
    this.error.value = undefined;
    this.processing.value = true;
    this.removing.value.push(id);

    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const response = await res.json();
      console.error(response);
      this.error.value = response;
    }
    const index = this.removing.value.findIndex((value) => value == id);
    this.removing.value.splice(index, 1);
    this.processing.value = false;
  }

  isRemoving(id: ID) {
    return this.removing.value.findIndex((value) => value === id) !== -1;
  }
}

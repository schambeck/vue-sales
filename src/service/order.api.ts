import type { Order } from "@/entity/order.entity";
import {
  BaseCreate,
  BaseFindById,
  BaseFindPage,
  BaseRemove,
  BaseUpdate,
} from "@/service/base.api";

const API_URL = import.meta.env.VITE_API_URL;

export const useCreateOrderApi = () => new BaseCreate<Order>(API_URL);
export const useUpdateOrderApi = () => new BaseUpdate<Order, number>(API_URL);
export const useRemoveOrderApi = () => new BaseRemove<number>(API_URL);
export const useFindByIdOrderApi = () =>
  new BaseFindById<Order, number>(API_URL);
export const useFindPageOrderApi = () => new BaseFindPage<Order>(API_URL);

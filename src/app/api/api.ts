"use server";

import { IProduct } from "./models/Product";
import { url } from "./utils";

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch(`${url}/products`, {
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

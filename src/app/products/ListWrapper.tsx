import { getProducts } from "../api/api";
import ProductList from "./ProductList";

export default async function ListWrapper() {
  const products = await getProducts();
  return <ProductList products={products} />;
}

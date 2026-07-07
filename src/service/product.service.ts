import axios from "axios";
import { IProduct } from "@/interface/response/product.response";

class ProductService {
  async getProducts(): Promise<IProduct[]> {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v2/products`);
    return response.data.data;
  }

  async getProductBySku(sku: string): Promise<IProduct> {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/v2/products/sku/${sku}`);
    return response.data.data;
  }
}

const productService = new ProductService();
export default productService;

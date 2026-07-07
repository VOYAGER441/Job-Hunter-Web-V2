import axiosInstance from "./axiosInstance";
import { IOrder, ICreateOrderResponse, IVerifyPaymentResponse } from "@/interface/response/order.response";

class OrderService {
  async createOrder(creditPack: string): Promise<ICreateOrderResponse> {
    const response = await axiosInstance.post("/v2/orders", { creditPack });
    return response.data.data;
  }

  async getOrders(): Promise<IOrder[]> {
    const response = await axiosInstance.get("/v2/orders");
    return response.data.data;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const response = await axiosInstance.get(`/v2/orders/${orderId}`);
    return response.data.data;
  }

  async verifyPayment(
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ): Promise<IVerifyPaymentResponse> {
    const response = await axiosInstance.post("/v2/orders/payments/verify", {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    });
    return response.data.data;
  }
}

const orderService = new OrderService();
export default orderService;
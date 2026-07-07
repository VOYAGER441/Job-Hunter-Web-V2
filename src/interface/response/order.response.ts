export interface IOrder {
  _id: string;
  userId: string;
  planId: string;
  creditPack: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  invoiceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  _id: string;
  orderId: string;
  userId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInvoice {
  _id: string;
  orderId: string;
  userId: string;
  invoiceNumber: string;
  amountBreakdown: {
    subtotal: number;
    tax: number;
    total: number;
  };
  pdfUrl: string;
  status: string;
  emailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface IVerifyPaymentResponse {
  orderId: string;
  paymentId: string;
  status: string;
  creditsAdded: number;
}
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || "",
  secretKey: process.env.IYZICO_SECRET_KEY || "",
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

export interface IyzicoCheckoutRequest {
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  basketId: string;
  paymentGroup: string;
  callbackUrl: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    identityNumber: string;
    email: string;
    gsmNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    ip: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  basketItems: {
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: string;
  }[];
}

export function initializeCheckoutForm(request: IyzicoCheckoutRequest): Promise<{
  status: string;
  errorCode?: string;
  errorMessage?: string;
  checkoutFormContent?: string;
  token?: string;
  tokenExpireTime?: number;
}> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(
      { locale: "tr", ...request },
      (err: Error | null, result: Record<string, unknown>) => {
        if (err) reject(err);
        else resolve(result as ReturnType<typeof initializeCheckoutForm> extends Promise<infer T> ? T : never);
      }
    );
  });
}

export function retrieveCheckoutForm(conversationId: string, token: string): Promise<{
  status: string;
  paymentStatus?: string;
  errorCode?: string;
  errorMessage?: string;
  paymentId?: string;
  basketId?: string;
  conversationId?: string;
}> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(
      { locale: "tr", conversationId, token },
      (err: Error | null, result: Record<string, unknown>) => {
        if (err) reject(err);
        else resolve(result as ReturnType<typeof retrieveCheckoutForm> extends Promise<infer T> ? T : never);
      }
    );
  });
}

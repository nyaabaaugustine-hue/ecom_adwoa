/**
 * lib/paystack.ts
 * Server-side Paystack helper — keeps the secret key out of the browser.
 */

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = "https://api.paystack.co";

interface InitializePaymentParams {
  email: string;
  amount: number; // in GHS — we convert to pesewas (×100)
  reference: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string; // "success" | "failed" | "abandoned"
    reference: string;
    amount: number; // in pesewas
    customer: { email: string; name: string };
    paid_at: string;
    metadata: Record<string, unknown>;
  };
}

export async function initializePayment(
  params: InitializePaymentParams
): Promise<PaystackInitResponse> {
  const response = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100), // convert GHS → pesewas
      reference: params.reference,
      callback_url:
        params.callback_url ??
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`,
      currency: "GHS",
      metadata: params.metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to initialize Paystack payment");
  }

  return response.json();
}

export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const response = await fetch(
    `${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to verify Paystack payment");
  }

  return response.json();
}

/** Generate a unique order reference */
export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ADWOA-${timestamp}-${random}`;
}

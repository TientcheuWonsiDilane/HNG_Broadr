export type FlutterwavePaymentStatus = {
  ok: boolean;
  payment?: Record<string, unknown>;
  message?: string;
};

export function getFlutterwaveConfig() {
  return {
    publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
    encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY || "",
  };
}

export function isFlutterwaveConfigured() {
  const { publicKey, secretKey, encryptionKey } = getFlutterwaveConfig();
  return Boolean(publicKey && secretKey && encryptionKey);
}

export async function verifyFlutterwavePayment(
  transactionId: string,
): Promise<FlutterwavePaymentStatus> {
  const { secretKey } = getFlutterwaveConfig();

  if (!transactionId) {
    return { ok: false, message: "A transaction id is required." };
  }

  if (!secretKey) {
    return {
      ok: false,
      message:
        "Flutterwave secret key is missing. Add FLUTTERWAVE_SECRET_KEY to your environment.",
    };
  }

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  const payload = await response.json();

  if (!response.ok || payload?.status !== "success") {
    return {
      ok: false,
      message: payload?.message || "Flutterwave verification failed.",
    };
  }

  return {
    ok: true,
    payment: payload.data,
    message: "Flutterwave payment verified.",
  };
}

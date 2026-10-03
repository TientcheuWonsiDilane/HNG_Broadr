import { NextResponse } from "next/server";
import {
  getFlutterwaveConfig,
  verifyFlutterwavePayment,
} from "@/lib/flutterwave";

export async function GET() {
  const { publicKey, secretKey, encryptionKey } = getFlutterwaveConfig();

  return NextResponse.json({
    publicKeyConfigured: Boolean(publicKey),
    secretKeyConfigured: Boolean(secretKey),
    encryptionKeyConfigured: Boolean(encryptionKey),
    status: publicKey && secretKey && encryptionKey ? "configured" : "pending",
  });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const transactionId = String(
    payload.transaction_id ?? payload.transactionId ?? "",
  );

  if (!transactionId) {
    return NextResponse.json(
      { ok: false, message: "Transaction ID is required." },
      { status: 400 },
    );
  }

  const verification = await verifyFlutterwavePayment(transactionId);

  if (!verification.ok) {
    return NextResponse.json(
      { ok: false, message: verification.message || "Verification failed." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    payment: verification.payment,
    message: verification.message || "Payment verified successfully.",
  });
}

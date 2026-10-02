import { NextResponse } from "next/server";
import { demoProducts } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json({ products: demoProducts });
}

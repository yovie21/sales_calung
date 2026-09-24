import { NextResponse } from "next/server";
import { PrismaClient } from "../../../src/generated/client";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.create({ data: body });
  return NextResponse.json(product);
}

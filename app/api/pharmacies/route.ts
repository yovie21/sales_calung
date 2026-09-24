import { NextResponse } from "next/server";
import { PrismaClient } from "../../../src/generated/client";

const prisma = new PrismaClient();

export async function GET() {
  const pharmacies = await prisma.pharmacy.findMany();
  return NextResponse.json(pharmacies);
}

export async function POST(request: Request) {
  const body = await request.json();
  const pharmacy = await prisma.pharmacy.create({ data: body });
  return NextResponse.json(pharmacy);
}

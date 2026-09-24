import { NextResponse } from "next/server";
import { PrismaClient } from "../../../src/generated/client";

const prisma = new PrismaClient();

export async function GET() {
  const consignments = await prisma.consignment.findMany({
    include: { pharmacy: true, items: true },
  });
  return NextResponse.json(consignments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const consignment = await prisma.consignment.create({ data: body });
  return NextResponse.json(consignment);
}

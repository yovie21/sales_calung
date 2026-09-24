import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../src/generated/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const product = await prisma.product.findUnique({ where: { id } });
  return NextResponse.json(product);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data = await request.json();
  const updated = await prisma.product.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const deleted = await prisma.product.delete({ where: { id } });
  return NextResponse.json(deleted);
}

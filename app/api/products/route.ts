import { prisma } from "@/lib/prisma";
import { fail, json, options } from "@/lib/cors";

export function OPTIONS(request: Request) {
  return options(request.headers.get("origin"));
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
    return json(products, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: String(body.name ?? "").trim(),
        price: Number(body.price ?? 0),
      },
    });
    return json(product, { status: 201, origin });
  } catch (e) {
    return fail(e, origin);
  }
}

export async function PUT(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return json({ error: "Missing id" }, { status: 400, origin });
    const body = await request.json();
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name != null ? { name: String(body.name).trim() } : {}),
        ...(body.price != null ? { price: Number(body.price) } : {}),
      },
    });
    return json(updated, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return json({ error: "Missing id" }, { status: 400, origin });
    await prisma.product.delete({ where: { id } });
    return json({ ok: true }, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

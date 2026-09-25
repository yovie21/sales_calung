import { prisma } from "@/lib/prisma";
import { fail, json, options } from "@/lib/cors";
import { deleteProductCascade } from "@/lib/cascade-delete";

export function OPTIONS(request: Request) {
  return options(request.headers.get("origin"));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get("origin");
  try {
    const { id: raw } = await params;
    const id = Number(raw);
    if (!id) return json({ error: "Missing id" }, { status: 400, origin });
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return json({ error: "Not found" }, { status: 404, origin });
    return json(product, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get("origin");
  try {
    const { id: raw } = await params;
    const id = Number(raw);
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get("origin");
  try {
    const { id: raw } = await params;
    const id = Number(raw);
    if (!id) return json({ error: "Missing id" }, { status: 400, origin });
    await deleteProductCascade(id);
    return json({ ok: true }, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

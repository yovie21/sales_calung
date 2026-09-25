import { prisma } from "@/lib/prisma";
import { fail, json, options } from "@/lib/cors";
import { deletePharmacyCascade } from "@/lib/cascade-delete";

export function OPTIONS(request: Request) {
  return options(request.headers.get("origin"));
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const pharmacies = await prisma.pharmacy.findMany({ orderBy: { id: "desc" } });
    return json(pharmacies, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const body = await request.json();
    const pharmacy = await prisma.pharmacy.create({
      data: {
        name: String(body.name ?? "").trim(),
        address: body.address ? String(body.address) : null,
        phone: body.phone ? String(body.phone) : null,
        picName: body.picName ? String(body.picName) : null,
      },
    });
    return json(pharmacy, { status: 201, origin });
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
    const updated = await prisma.pharmacy.update({
      where: { id },
      data: {
        ...(body.name != null ? { name: String(body.name).trim() } : {}),
        ...(body.address != null ? { address: String(body.address) } : {}),
        ...(body.phone != null ? { phone: String(body.phone) } : {}),
        ...(body.picName != null ? { picName: String(body.picName) } : {}),
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
    await deletePharmacyCascade(id);
    return json({ ok: true }, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

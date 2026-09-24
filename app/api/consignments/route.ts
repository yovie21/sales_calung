import { prisma } from "@/lib/prisma";
import { fail, json, options } from "@/lib/cors";

const include = {
  pharmacy: true,
  items: { include: { product: true } },
};

export function OPTIONS(request: Request) {
  return options(request.headers.get("origin"));
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (id) {
      const consignment = await prisma.consignment.findUnique({
        where: { id },
        include,
      });
      if (!consignment) return json({ error: "Not found" }, { status: 404, origin });
      return json(consignment, { origin });
    }
    const consignments = await prisma.consignment.findMany({
      include,
      orderBy: { id: "desc" },
    });
    return json(consignments, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const body = await request.json();
    if (body.consignmentId && body.productId) {
      const item = await prisma.consignmentItem.create({
        data: {
          consignmentId: Number(body.consignmentId),
          productId: Number(body.productId),
          qty: Number(body.qty ?? 0),
          price: Number(body.price ?? 0),
          remainingQty: Number(body.remainingQty ?? body.qty ?? 0),
        },
      });
      return json(item, { status: 201, origin });
    }
    const items = Array.isArray(body.items) ? body.items : [];
    const consignment = await prisma.consignment.create({
      data: {
        pharmacyId: Number(body.pharmacyId),
        date: String(body.date ?? new Date().toISOString().slice(0, 10)),
        paid: Number(body.paid ?? 0),
        paidAmount: Number(body.paidAmount ?? 0),
        lastVisitDate: body.lastVisitDate ?? null,
        paymentMethod: body.paymentMethod ?? null,
        paymentNotes: body.paymentNotes ?? null,
        visitNotes: body.visitNotes ?? null,
        items: items.length
          ? {
              create: items.map((i: { productId: number; qty: number; price: number; remainingQty?: number }) => ({
                productId: Number(i.productId),
                qty: Number(i.qty ?? 0),
                price: Number(i.price ?? 0),
                remainingQty: Number(i.remainingQty ?? i.qty ?? 0),
              })),
            }
          : undefined,
      },
      include,
    });
    return json(consignment, { status: 201, origin });
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
    if (body.remainingQty != null && !body.pharmacyId) {
      const item = await prisma.consignmentItem.update({
        where: { id },
        data: { remainingQty: Number(body.remainingQty) },
      });
      return json(item, { origin });
    }
    const updated = await prisma.consignment.update({
      where: { id },
      data: {
        ...(body.paid != null ? { paid: Number(body.paid) } : {}),
        ...(body.paidAmount != null ? { paidAmount: Number(body.paidAmount) } : {}),
        ...(body.lastVisitDate != null ? { lastVisitDate: String(body.lastVisitDate) } : {}),
        ...(body.paymentMethod != null ? { paymentMethod: String(body.paymentMethod) } : {}),
        ...(body.visitNotes != null ? { visitNotes: String(body.visitNotes) } : {}),
        ...(body.paymentNotes != null ? { paymentNotes: String(body.paymentNotes) } : {}),
      },
      include,
    });
    return json(updated, { origin });
  } catch (e) {
    return fail(e, origin);
  }
}

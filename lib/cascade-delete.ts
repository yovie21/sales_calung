import { prisma } from "@/lib/prisma";

export async function deleteProductCascade(id: number) {
  await prisma.$transaction([
    prisma.consignmentItem.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } }),
  ]);
}

export async function deletePharmacyCascade(id: number) {
  const cons = await prisma.consignment.findMany({
    where: { pharmacyId: id },
    select: { id: true },
  });
  const ids = cons.map((c) => c.id);
  await prisma.$transaction([
    ...(ids.length
      ? [prisma.consignmentItem.deleteMany({ where: { consignmentId: { in: ids } } })]
      : []),
    prisma.consignment.deleteMany({ where: { pharmacyId: id } }),
    prisma.pharmacy.delete({ where: { id } }),
  ]);
}

export async function deleteConsignmentCascade(id: number) {
  await prisma.$transaction([
    prisma.consignmentItem.deleteMany({ where: { consignmentId: id } }),
    prisma.consignment.delete({ where: { id } }),
  ]);
}

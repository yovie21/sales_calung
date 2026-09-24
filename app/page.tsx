"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [consignments, setConsignments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));

    fetch("/api/pharmacies")
      .then((res) => res.json())
      .then((data) => setPharmacies(data))
      .catch((err) => console.error(err));

    fetch("/api/consignments")
      .then((res) => res.json())
      .then((data) => setConsignments(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Dashboard Titip Obat</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Produk</h2>
          <ul>
            {products.map((p: any) => (
              <li key={p.id} className="mb-2">
                {p.name} - Rp{p.price}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Apotek</h2>
          <ul>
            {pharmacies.map((ph: any) => (
              <li key={ph.id}>{ph.name}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Nota</h2>
          <ul>
            {consignments.map((c: any) => (
              <li key={c.id}>{c.date} - {c.salesmanName}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
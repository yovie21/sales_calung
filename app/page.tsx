"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string; price: number };
type Pharmacy = { id: number; name: string };
type Consignment = { id: number; date: string; pharmacy?: { name: string } };

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async (path: string) => {
      const res = await fetch(path);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || path);
      return data;
    };
    Promise.all([load("/api/products"), load("/api/pharmacies"), load("/api/consignments")])
      .then(([p, ph, c]) => {
        setProducts(Array.isArray(p) ? p : []);
        setPharmacies(Array.isArray(ph) ? ph : []);
        setConsignments(Array.isArray(c) ? c : []);
      })
      .catch((e) => setError(String(e.message || e)));
  }, []);

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Dashboard Titip Obat</h1>
      {error ? <p className="mb-4 text-red-600">API error: {error}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Produk ({products.length})</h2>
          <ul>
            {products.map((p) => (
              <li key={p.id} className="mb-2">
                {p.name} - Rp{p.price}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Apotek ({pharmacies.length})</h2>
          <ul>
            {pharmacies.map((ph) => (
              <li key={ph.id}>{ph.name}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Nota ({consignments.length})</h2>
          <ul>
            {consignments.map((c) => (
              <li key={c.id}>
                {c.date} - {c.pharmacy?.name ?? "-"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

import { NextResponse } from "next/server";

const ALLOW_HEADERS = "Content-Type, Authorization";
const ALLOW_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";

export function corsHeaders(origin?: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": ALLOW_METHODS,
    "Access-Control-Allow-Headers": ALLOW_HEADERS,
    Vary: "Origin",
  };
}

export function json(data: unknown, init?: { status?: number; origin?: string | null }) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: corsHeaders(init?.origin),
  });
}

export function options(origin?: string | null) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export function fail(error: unknown, origin?: string | null) {
  const message = error instanceof Error ? error.message : "Server error";
  console.error(error);
  return json({ error: message }, { status: 500, origin });
}

import { NextResponse } from "next/server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://8jjcricket.com/api";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params?.id;

  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  // const local_base = "http://127.0.0.1:8000/api";
  try {
    const upstream = await fetch(`${API_BASE}/catalog/${id}`, {
      // Cache at the Next server layer (optional)
      next: { revalidate: 300 },
    });

    const text = await upstream.text();

    // Pass through status + body
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Upstream fetch failed" },
      { status: 500 }
    );
  }
}

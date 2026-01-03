import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params?.id;

  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const upstream = await fetch(`https://8jjcricket.com/api/catalog/${id}`, {
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

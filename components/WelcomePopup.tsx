"use client";

import { useEffect, useState } from "react";
import IconButton from "./ui/IconButton";
import PrimaryButton from "./ui/PrimaryButton";
import { X } from "lucide-react";
import { popupRespond } from "@/types/popup";

const backendUrlStorage = `${process.env.NEXT_PUBLIC_BACKEND_BASE || "https://8jjcricket.com"}/storage/`;

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<popupRespond | null>();
  const [imageLoaded, setImageLoaded] = useState(false);
  async function fetchImages(): Promise<popupRespond | null> {
    try {
      // ✅ Same-origin request to Next.js API proxy (no CORS issues)
      const res = await fetch(`/api/popups`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Failed to load images: ${res.status}`);

      const json = await res.json();
      return json[0];
    } catch (error) {
      console.error("Error fetching images:", error);
      return null;
    }
  }

  useEffect(() => {
    fetchImages()
      .then((popup) => {
        setData(popup);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Show on every visit / refresh
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!data?.image_path) return;

    const img = new Image();
    img.src = `${backendUrlStorage}${data.image_path}`;
    img.onload = () => setImageLoaded(true);
  }, [data]);

  if (!open || !data?.image_path || !imageLoaded) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl">
        <IconButton
          onClick={() => setOpen(false)}
          ariaLabel="Close popup"
          className="absolute right-3 top-3 z-10 hover:bg-red-500/80"
          size="sm"
          icon={<X size={16} />}
        />

        <a href={data.link} className="relative w-full h-[280px]">
          <img
            src={`${backendUrlStorage}${data.image_path}`}
            alt="Welcome banner"
            className="w-full h-full object-cover"
          />
        </a>

        <div className="p-4 text-center">
          <h3 className="text-lg font-extrabold text-white">
            Welcome to 8JJCRICKET
          </h3>

          <PrimaryButton
            onClick={() => setOpen(false)}
            className="mt-4 w-full uppercase tracking-wide text-xs h-10"
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

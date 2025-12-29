// app/portraits/page.tsx
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import PortraitShowcaseSection from "@/components/PortraitShowcaseSection";

export default function PortraitsPage() {
  return (
    <>
      <TopNav />

      <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
            <PortraitShowcaseSection />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

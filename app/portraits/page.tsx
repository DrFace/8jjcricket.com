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
          <div className="rounded-3xl border border-india-gold/20 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <PortraitShowcaseSection />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

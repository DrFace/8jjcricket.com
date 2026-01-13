import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopOnly from "@/components/DesktopOnly";
import LiveScoreHome from "./LiveScoreClient";

export default function LiveScorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <DesktopOnly>
          <LiveScoreHome />
        </DesktopOnly>
      </main>
      <Footer />
    </div>
  );
}

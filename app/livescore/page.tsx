
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopOnly from "@/components/DesktopOnly";
import LiveScoreHome from "./LiveScoreClient";

export default function LiveScorePage() {
  return (
    <>
      <TopNav />
      <DesktopOnly>
        <LiveScoreHome />
      </DesktopOnly>
      <Footer />
    </>
  );
}


import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopOnly from "@/components/DesktopOnly";
// Update the import path below to the correct relative or alias path where DesktopScoreClient actually exists
// Example using a relative path (adjust as needed):
import DesktopScoreClient from "./LiveScoreClient";

export default function LiveScorePage() {
  return (
    <>
      <TopNav />
      <DesktopOnly>
        <DesktopScoreClient />
      </DesktopOnly>
      <Footer />
    </>
  );
}
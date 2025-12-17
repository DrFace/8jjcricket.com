import DesktopOnly from "@/components/DesktopOnly";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MatchCentre from "@/components/MatchCentre";

export const dynamic = "force-dynamic";

export default function LiveScorePage() {
    return (
        <>
            <TopNav />

            <DesktopOnly>
                <main className="mx-auto w-full max-w-6xl px-4 py-6">
                    <header className="mb-4">
                        <h1 className="text-2xl font-semibold">Live Scores</h1>
                        <p className="text-sm opacity-80">
                            Real-time match updates and scorecards
                        </p>
                    </header>

                    <MatchCentre />
                </main>
            </DesktopOnly>

            <Footer />
        </>
    );
}

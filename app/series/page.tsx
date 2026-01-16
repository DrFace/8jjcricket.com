import { Suspense } from "react";
import SeriesClient from "./SeriesClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading series…</div>}>
      <SeriesClient />
    </Suspense>
  );
}

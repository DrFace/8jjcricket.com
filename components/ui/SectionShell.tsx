import React from "react";

export default function SectionShell({ children }: React.PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl overflow-hidden shadow-2xl">
      {children}
    </div>
  );
}

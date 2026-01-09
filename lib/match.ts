export function FormatOvers(overs: number | string | null | undefined) {
  if (overs === null || overs === undefined) return "";
  return typeof overs === "number" ? `${overs}` : overs;
}
export function ExtractTarget(note?: string | null) {
  if (!note) return null;
  const m = note.match(/target\s+(\d+)/i);
  return m ? Number(m[1]) : null;
}

export function ScoreLine(r: any) {
  if (!r) return "—";
  const s = r.score ?? 0;
  const w = r.wickets ?? 0;
  const o = FormatOvers(r.overs);
  return `${s}/${w}${o ? ` (${o})` : ""}`;
}

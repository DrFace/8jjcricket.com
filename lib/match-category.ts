export function MatchCategory(item: any, category: string) {
  const cat = String(item?.type ?? "").toLowerCase();
  if (category === "All") return true;
  if (!cat) return false;

  if (category === "Leagues") {
    return !["international", "odi", "t20", "test"].some((c) =>
      cat.includes(c)
    );
  }
  if (category === "International") return cat.includes("international");
  if (category === "T20") return cat.includes("t20");
  if (category === "ODI") return cat.includes("odi");
  if (category === "Test") return cat.includes("test");
  return false;
}

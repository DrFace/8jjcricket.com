export function MatchCategory(item: any, category: string) {
  const type = item.type?.toLowerCase() || "";
  const leagueName = item.league?.name?.toLowerCase() || "";

  if (category === "All") return true;

  if (category === "T20") return type === "t20";
  if (category === "ODI") return type === "odi";
  if (category === "Test") return type === "test";

  if (category === "International") {
    return leagueName.includes("international");
  }

  if (category === "Leagues") {
    return !["t20", "odi", "test"].includes(type);
  }

  return true;
}

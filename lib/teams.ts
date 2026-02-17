import { TeamFromAPI } from "@/types/team";

const PLACEHOLDER = "/images/cricket-team-placeholder.png";

export function HasValidImage(team: TeamFromAPI): boolean {
  const img = team?.image_path?.trim();

  if (!img || img === "null" || img === "undefined") return false;

  // ✅ Sportmonks "missing image" example:
  // images/cricket/teams/0/64.png
  if (!img.includes("images/cricket/teams")) return false;

  return true;
}

export function GetTeamImageSrc(imagePath?: string) {
  const img = imagePath?.trim();

  // ✅ missing/null/undefined
  if (!img || img === "null" || img === "undefined") {
    return PLACEHOLDER;
  }

  // ✅ "missing team image" pattern
  if (!img.includes("images/cricket/teams")) {
    return PLACEHOLDER;
  }

  // ✅ valid image path -> return as it is (no base url add)
  return img;
}

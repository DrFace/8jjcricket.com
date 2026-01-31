import { ArchivesResponse, ArchiveFilters } from "@/types/archive";

// Use Next.js API routes (relative path for client-side fetch)
const API_BASE_URL = "/api";

/**
 * Build query string from filter parameters
 */
export function BuildQueryString(filters?: ArchiveFilters): string {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.date) params.append("date", filters.date);
  if (filters.format) params.append("format", filters.format);
  if (filters.category) params.append("category", filters.category);
  if (filters.per_page) params.append("per_page", filters.per_page.toString());
  if (filters.page) params.append("page", filters.page.toString());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Fetch archives with optional filters
 * @param filters - Optional filter parameters
 * @returns Promise<ArchivesResponse>
 * @throws Error if the request fails
 */
export async function getArchives(
  filters?: ArchiveFilters,
): Promise<ArchivesResponse> {
  try {
    console.log("call getArchives");
    const apibase = "https://8jjcricket.com/api";
    const queryString = BuildQueryString(filters);
    console.log("queryString", queryString);
    const url = `${apibase}/archives${queryString}`;
    console.log("Arc url", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store", // Disable caching for dynamic data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Failed to fetch archives: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    const data: ArchivesResponse = await response.json();
    console.log("Fetched Archives Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching archives:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect to the API. Please check if the backend server is running.",
      );
    }
    throw error;
  }
}

/**
 * Get a single archive by ID (if needed in the future)
 * @param id - Archive ID
 */
export async function getArchiveById(id: number): Promise<any> {
  try {
    const url = `${API_BASE_URL}/archives/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch archive: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching archive:", error);
    throw error;
  }
}

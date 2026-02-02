import { FetchJson } from "@/lib/fetcher";
import { SponsorRespond } from "@/types/sponsors";
import useSWR from "swr";

export function useSponsors() {
  const { data, error, isLoading } = useSWR<SponsorRespond[]>(
    "/api/sponsors",
    FetchJson,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60_000,
    },
  );

  return {
    sponsors: data,
    isLoading,
    error,
  };
}

import { useQuery } from "@tanstack/react-query";

export function useScanBarcode(barcode) {
  return useQuery({
    queryKey: ["scan", barcode],
    queryFn: async () => {
      const res = await fetch(`/api/scan/${barcode}`);
      if (res.status === 404) throw new Error("NOT_FOUND");
      if (!res.ok) throw new Error("NETWORK_ERROR");
      return res.json();
    },
    enabled: !!barcode,
    retry: false,
  });
}
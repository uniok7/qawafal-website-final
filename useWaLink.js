import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API, waLink } from "@/lib/format";

// Reactive wa.me link builder: re-renders consumers when the
// admin-editable settings.whatsapp number loads/changes.
export function useWaLink() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });
  return (message) => waLink(message, settings?.whatsapp);
}

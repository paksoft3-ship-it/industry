import { getSettings } from "@/lib/actions/settings";
import AdminAyarlarClient from "./AdminAyarlarClient";

export default async function AdminAyarlarPage() {
  const settingsRaw = await getSettings();
  const settings = JSON.parse(JSON.stringify(settingsRaw));
  return <AdminAyarlarClient settings={settings} />;
}

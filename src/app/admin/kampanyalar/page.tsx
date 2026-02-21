import { getCoupons } from "@/lib/actions/coupons";
import AdminKampanyalarClient from "./AdminKampanyalarClient";

export default async function AdminKampanyalarPage() {
  const couponsRaw = await getCoupons();
  const coupons = JSON.parse(JSON.stringify(couponsRaw));
  return <AdminKampanyalarClient coupons={coupons} />;
}

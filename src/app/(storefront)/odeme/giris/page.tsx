import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import GuestCheckoutGate from "./GuestCheckoutGate";

export default async function OdemeGirisPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/odeme");
  }

  return <GuestCheckoutGate />;
}

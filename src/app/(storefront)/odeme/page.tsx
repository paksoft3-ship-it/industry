import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OdemeClient from "./OdemeClient";

export default async function OdemePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  const params = await searchParams;
  const guestEmail = params.guestEmail;

  // If not logged in and no guest email → redirect to checkout gate
  if (!session?.user && !guestEmail) {
    redirect("/odeme/giris");
  }

  return <OdemeClient guestEmail={guestEmail} />;
}

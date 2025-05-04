// app/ather/page.tsx or wherever this page lives
import AtherComponent from "@/components/AtherComponent";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AtherPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    
  }

  return <AtherComponent />;
}

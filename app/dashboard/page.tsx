"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending)
    return <p className="text-center mt-8 text-white">Loading...</p>;
  if (!session?.user)
    return <p className="text-center mt-8 text-white">Redirecting...</p>;

  const { user } = session;

  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
      <h1 className="text-2xl font-bold text-black">Dashboard</h1>
      <p className="text-black">Welcome, {user.name || "User"}!</p>
      <p className="text-black">Email: {user.email}</p>
      <button
        onClick={() => signOut()}
        className="w-full bg-black text-white font-medium rounded-md px-4 py-2 hover:bg-gray-200"
      >
        Sign Out
      </button>
    </main>
  );
}
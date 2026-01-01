import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to Better Auth App</h1>
      <Image
        src="/logo.png"
        alt="Better Auth Logo"
        width={200}
        height={200}
        className="mb-8"
      />
      <p className="text-lg">
        Get started by signing up or logging in to access your dashboard.
      </p>
    </main>
  );
}

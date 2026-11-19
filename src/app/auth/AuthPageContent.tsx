"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { mockProducts } from "@/lib/mockData";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthPageContent() {
  return (
    <Suspense fallback={null}>
      <AuthPage />
    </Suspense>
  );
}

function AuthPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/shop";

  return (
    <div className="min-h-screen flex pt-16">
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-16 max-w-lg mx-auto w-full">
        <AuthForm
          initialMode={searchParams.get("tab") === "register" ? "register" : "login"}
          onSignedIn={() => {
            window.location.href = redirectTo;
          }}
        />
      </div>

      {/* Right: a few pieces from the rail (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-paper-2 items-center justify-center px-12">
        <div className="max-w-md w-full">
          <ul className="grid grid-cols-2 gap-4">
            {["3", "24", "8", "13"].map((id) => {
              const p = mockProducts.find((x) => x.id === id);
              if (!p) return null;
              return (
                <li key={id} className="relative aspect-[3/4] bg-white rounded-sm overflow-hidden">
                  <Image src={p.images[0]} alt={p.name} fill sizes="200px" className="object-contain p-3" />
                </li>
              );
            })}
          </ul>
          <p className="mt-8 font-display text-2xl text-ink">Your first rental is ₹500 less.</p>
          <p className="mt-2 text-sm text-ink/70">
            The credit is added to your account when you register and comes off at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

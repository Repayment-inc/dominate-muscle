'use client'

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AuthRedirect } from "@/components/auth/auth-redirect";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRedirect>
      <Header />
      {children}
      <Footer />
    </AuthRedirect>
  );
}
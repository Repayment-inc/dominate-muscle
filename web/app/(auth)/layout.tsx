import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaDumbbell } from "react-icons/fa6";
import { AuthRedirect } from "@/components/auth/auth-redirect";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthRedirect>
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center bg-opacity-0">
              <FaDumbbell size={100} color="blue" />
            </Link>
          </div>
        </div>
        {children}
      </div>
    </AuthRedirect>
  );
};
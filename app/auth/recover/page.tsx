import type { Metadata } from "next";

import RecoverPasswordPage from "@/components/auth/recover-page";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RecoverPasswordRoute() {
  return <RecoverPasswordPage />;
}
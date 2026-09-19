import type { Metadata } from "next";

import ForgotPasswordPage from "@/components/auth/forgot-password-page";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Request a password reset link for your Laws & Judgments account.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
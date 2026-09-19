import type { Metadata } from "next";

import UpdatePasswordPage from "@/components/auth/update-password-page";

export const metadata: Metadata = {
  title: "Update Password",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function UpdatePasswordRoute() {
  return <UpdatePasswordPage />;
}
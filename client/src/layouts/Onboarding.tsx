import Navbar from "@/components/layouts/onboarding/Navbar";
import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="bg-white">
      <Navbar />
      {children}
    </div>
  );
}

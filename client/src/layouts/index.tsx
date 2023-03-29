import { ReactNode } from "react";
import Navbar from "@/components/layouts/main/Navbar";
import Sidebar from "@/components/layouts/main/Sidebar";
import ShareFile from "@/components/dialogs/ShareFile";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="bg-white">
      <ShareFile />
      <Navbar />
      <main className="grid grid-cols-8 gap-4 px-16 py-8 border-r mt-16">
        <div className="hidden md:block md:col-span-2">
          <Sidebar />
        </div>
        <div className={`col-span-8 md:col-span-6`}>{children}</div>
      </main>
    </div>
  );
}

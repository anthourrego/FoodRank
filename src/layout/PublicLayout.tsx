import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Outlet } from "react-router";

export const PublicLayout = () => {
  return (
    <div className="h-screen overflow-x-hidden">
      <Header />
      <main className="overflow-auto overflow-x-hidden min-h-[calc(100vh-118px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


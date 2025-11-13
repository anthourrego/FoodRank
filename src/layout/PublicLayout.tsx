import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Outlet } from "react-router";

export const PublicLayout = () => {
  return (
    <div className="h-screen overflow-x-hidden">
      <main className="overflow-x-hidden">
        <Header />
        <div className="overflow-auto overflow-x-hidden min-h-[calc(100vh-118px)]">
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  );
};


import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Outlet } from "react-router";

export const PrivateLayout = () => {
  return (
    <div className="h-screen ">
      <main>
        <Header />
        <div className="overflow-auto min-h-[calc(100vh-118px)]">
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  );
};

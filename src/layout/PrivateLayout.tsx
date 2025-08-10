import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Outlet } from "react-router";

export const PrivateLayout = () => {
  return (
    <div className="min-h-screen w-full bg-background ">
      <Header />
      <main className="!h-[calc(100vh-118px)]">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

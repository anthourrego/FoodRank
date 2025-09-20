import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route } from "react-router";
import { RoutesNotFound } from "./NotFound";
import GenerateQr from "@/features/public/qr/GenerateQr";
import { PrivateLayout } from "@/layout/PrivateLayout";
import AuthProvider from "@/features/public/auth/context/AuthProvider";
import { Loader2 } from "lucide-react";

const Login = lazy(() => import("@/features/public/auth/page/Login"));
const RateProducts = lazy(
  () => import("@/features/public/rate-products/page/RateProducts")
);
const RateProductsVoting = lazy(
  () => import("@/features/public/rate-products-voting/page/RateProductsVoting")
);

export function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin w-12 h-12 text-red-800" />
        </div>
      }
    >
      <AuthProvider>
        <BrowserRouter>
          <RoutesNotFound>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateLayout />}>
              <Route
                path="/"
                element={<Navigate to="/rate-product" replace />}
              />
              <Route path="/rate-product" element={<RateProducts />} />
              <Route
                path="/rate-product/:productId"
                element={<RateProductsVoting />}
              />
              <Route path="/qr" element={<GenerateQr />} />
            </Route>
          </RoutesNotFound>
        </BrowserRouter>
      </AuthProvider>
    </Suspense>
  );
}

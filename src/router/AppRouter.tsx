import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route } from "react-router";
import { RoutesNotFound } from "./NotFound";
import { PrivateGuard } from "./PrivateGuard";

import AuthProvider from "@/features/public/auth/context/AuthProvider";
import { Loading } from "@/components/ui/loading";

const Login = lazy(() => import("@/features/public/auth/page/Login"));
const PrivateRouter = lazy(() => import("./PrivateRouter"));
const RateProductsVoting = lazy(
  () => import("@/features/public/rate-products-voting/page/RateProductsVoting")
);
const RateProducts = lazy(
  () => import("@/features/public/rate-products/page/RateProducts")
);
const Events = lazy(
  () => import("@/features/public/events/page/index")
);

export function AppRouter() {
  return (
    <Suspense
      fallback={
        <Loading
          classNameLoader="w-12 h-12"
          className="min-h-screen flex items-center justify-center"
        />
      }
    >
      <AuthProvider>
        <BrowserRouter>
          <RoutesNotFound>
            <Route path="/" element={<Navigate to="/rate-product" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events-products/:eventId" element={<RateProducts />} />
            <Route
              path="/rate-product/:productId"
              element={<RateProductsVoting />}
            />

            <Route element={<PrivateGuard />}>
              <Route path="/home/*" element={<PrivateRouter />} />
            </Route>
          </RoutesNotFound>
        </BrowserRouter>
      </AuthProvider>
    </Suspense>
  );
}

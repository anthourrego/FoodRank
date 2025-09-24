import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route } from "react-router";
import { RoutesNotFound } from "./NotFound";
import GenerateQr from "@/features/public/qr/GenerateQr";
import { PrivateLayout } from "@/layout/PrivateLayout";
import { RankingProductEvent } from "@/features/public/ranking-product-event/RankingProductEvent";
import AuthProvider from "@/features/public/auth/context/AuthProvider";
import { Loading } from "@/components/ui/loading";

const Login = lazy(() => import("@/features/public/auth/page/Login"));
const RateProducts = lazy(
  () => import("@/features/public/rate-products/page/RateProducts")
);
const RateProductsVoting = lazy(
  () => import("@/features/public/rate-products-voting/page/RateProductsVoting")
);
const Ranking = lazy(() => import("@/features/public/ranking/Ranking"));
const Restaurant = lazy(
  () => import("@/features/public/restaurant/page/RestaurantPage")
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
              <Route path="/restaurants" element={<Restaurant />} />
              <Route path="/qr" element={<GenerateQr />} />
              <Route path="/r4nk1ngh1dd3n" element={<Ranking />} />
              <Route
                path="/raking/product-event/:productEventId"
                element={<RankingProductEvent />}
              />
            </Route>
          </RoutesNotFound>
        </BrowserRouter>
      </AuthProvider>
    </Suspense>
  );
}

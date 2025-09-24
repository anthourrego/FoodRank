import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route } from "react-router";
import { RoutesNotFound } from "./NotFound";
import { PrivateGuard } from "./PrivateGuard";





const Login = lazy(() => import('@/features/public/auth/page/Login'))
const PrivateRouter = lazy(() => import('./PrivateRouter'))
const RateProductsVoting = lazy(() => import('@/features/public/rate-products-voting/page/RateProductsVoting'))
const RateProducts = lazy(() => import('@/features/public/rate-products/page/RateProducts'))
export function AppRouter() {
  return (
    <Suspense fallback={<>Cargando.........................</>}>
      <BrowserRouter>
        <RoutesNotFound>
          <Route path="/" element={<Navigate to="/rate-product" replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/rate-product" element={<RateProducts />} />
          <Route
            path="/rate-product/:productId"
            element={<RateProductsVoting />}
          />
          <Route element={<PrivateGuard/>}>
            <Route path="/home/*" element={<PrivateRouter/>} />
          </Route>
        </RoutesNotFound>
      </BrowserRouter>
      
    </Suspense>
  )
}
import { lazy, Suspense } from "react";
import { BrowserRouter, HashRouter, Navigate, Route } from "react-router";
import { RoutesNotFound } from "./NotFound";
import GenerateQr from "@/features/public/qr/GenerateQr";
import { PrivateLayout } from "@/layout/PrivateLayout";



const Login = lazy(() => import('@/features/public/auth/page/Login'))
const RateProducts = lazy(() => import('@/features/public/rate-products/page/RateProducts'))
const RateProductsVoting = lazy(() => import('@/features/public/rate-products-voting/page/RateProductsVoting'))

export function AppRouter() {
  return (
    <Suspense fallback={<>Cargando.........................</>}>
      <BrowserRouter>
        <RoutesNotFound>
          <Route element={<PrivateLayout/>}>
            <Route path="/" element={<Navigate to="/rate-product" replace/>} />
            <Route path="/login" element={<Login/>} />
            <Route path='/rate-product' element={<RateProducts/>} />
            <Route path='/rate-product/:productId' element={<RateProductsVoting/>} />
            <Route path='/qr' element={<GenerateQr />} />
          </Route>
        </RoutesNotFound>
      </BrowserRouter>

    </Suspense>
  )
}
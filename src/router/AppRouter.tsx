import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route } from "react-router";
import { RoutesNotFound } from "./NotFound";
import GenerateQr from "@/features/public/qr/GenerateQr";



const Login = lazy(() => import('@/features/public/auth/page/Login'))
const RateProducts = lazy(() => import('@/features/public/rate-products/page/RateProducts'))
const RateProductsVoting = lazy(() => import('@/features/public/rate-products-voting/page/RateProductsVoting'))

export function AppRouter() {
  const qrData = {
    url: "https://example.com/profile",
  };

  return (
    <Suspense fallback={<>Cargando.........................</>}>
      <HashRouter>
        <RoutesNotFound>

          <Route path="/" element={<Navigate to="/rate-product" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path='/rate-product' element={<RateProducts />} />
          <Route path='/rate-product/:productId' element={<RateProductsVoting />} />
          <Route path='/qr' element={<GenerateQr dataQr={qrData} descriptionShare="Escanea el QR" titleShare="Vota por tu producto favorito"  />} />
        </RoutesNotFound>
      </HashRouter>

    </Suspense>
  )
}
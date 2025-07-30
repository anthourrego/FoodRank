import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route } from "react-router";
import { RoutesNotFound } from "./NotFound";



const Login = lazy(()=> import('@/features/public/auth/page/Login'))
const RateProducts = lazy(()=> import('@/features/public/rate-products/page/RateProducts'))

export function AppRouter(){
  return(
    <Suspense fallback={<>Cargando.........................</>}>
      <HashRouter>
        <RoutesNotFound>

          <Route path="/" element={<Navigate to="/rate-product" replace/>} />
          <Route path="/login" element={<Login/>} />
          <Route path='/rate-product' element={<RateProducts/>} />
        </RoutesNotFound>
      </HashRouter>

    </Suspense>
  )
}
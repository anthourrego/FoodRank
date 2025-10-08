import { PrivateLayout } from "@/layout/PrivateLayout";
import { RoutesNotFound } from "./NotFound";
import {  Navigate, Route } from "react-router";
import { lazy } from "react";


const Ranking = lazy(() => import("@/features/private/ranking/Ranking"));
const GenerateQr = lazy(() => import("@/features/private/qr/GenerateQr"));
const RankingProductEvent = lazy(() => import("@/features/private/ranking-product-event/RankingProductEvent"));
const Restaurant = lazy(() => import("@/features/private/restaurant/page/RestaurantPage"));
const RestaurantBranch = lazy(() => import("@/features/private/restaurant/page/RestaurantBranchPage"));
const ProductsRestaurant = lazy(() => import("@/features/private/products-restaurant/page/ProductsRestaurantPage"));
const Configuration = lazy(() => import("@/features/private/configuration/page/Configuration"));

const privateRouter = () => {
  return (
    <RoutesNotFound>
      <Route path="/" element={<PrivateLayout />}>
        <Route
          path="/"
          element={<Navigate to={`/home/restaurants`} />}
        />
        <Route path="/qr" element={<GenerateQr />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route
          path="/raking/product-event/:productEventId"
          element={<RankingProductEvent />}
        />
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/restaurants/:restaurantId/branchs" element={<RestaurantBranch />} />
        <Route path="/products-restaurant" element={<ProductsRestaurant />} />
        <Route path="/configuration" element={<Configuration />} />
      </Route>
    </RoutesNotFound>
  );
};

export default privateRouter;

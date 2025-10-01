import { PrivateLayout } from "@/layout/PrivateLayout";
import { RoutesNotFound } from "./NotFound";
import {  Navigate, Route } from "react-router";
import { lazy } from "react";


const Ranking = lazy(() => import("@/features/private/ranking/Ranking"));
const GenerateQr = lazy(() => import("@/features/private/qr/GenerateQr"));
const RankingProductEvent = lazy(
  () => import("@/features/private/ranking-product-event/RankingProductEvent")
);
const Restaurant = lazy(() => import("@/features/private/restaurant/page/RestaurantPage"));
const RestaurantBranch = lazy(() => import("@/features/private/restaurant/page/RestaurantBranchPage"));
const privateRouter = () => {
  return (
    <RoutesNotFound>
      <Route path="/" element={<PrivateLayout />}>
        <Route
          path="/"
          element={<Navigate to={`/home/restaurants`} />}
        />
        <Route path="/qr" element={<GenerateQr />} />
        <Route path="/r4nk1ngh1dd3n" element={<Ranking />} />
        <Route
          path="/raking/product-event/:productEventId"
          element={<RankingProductEvent />}
        />
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/restaurants/:restaurantId/branchs" element={<RestaurantBranch />} />
      </Route>
    </RoutesNotFound>
  );
};

export default privateRouter;

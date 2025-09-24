import { PrivateLayout } from "@/layout/PrivateLayout";
import { RoutesNotFound } from "./NotFound";
import { Navigate, Route } from "react-router";
import { lazy } from "react";

const RateProducts = lazy(
  () => import("@/features/public/rate-products/page/RateProducts")
);
const RateProductsVoting = lazy(
  () => import("@/features/public/rate-products-voting/page/RateProductsVoting")
);
const Ranking = lazy(() => import("@/features/public/ranking/Ranking"));
const GenerateQr = lazy(() => import("@/features/public/qr/GenerateQr"));
const RankingProductEvent = lazy(
  () => import("@/features/public/ranking-product-event/RankingProductEvent")
);

const privateRouter = () => {
  return (
    <RoutesNotFound>
      <Route path="/" element={<PrivateLayout />}>
        
        <Route path="/qr" element={<GenerateQr />} />
        <Route path="/r4nk1ngh1dd3n" element={<Ranking />} />
        <Route
          path="/raking/product-event/:productEventId"
          element={<RankingProductEvent />}
        />
      </Route>
    </RoutesNotFound>
  );
};

export default privateRouter;

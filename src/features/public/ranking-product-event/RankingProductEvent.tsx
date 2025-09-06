import { Link, useParams } from "react-router";
import { useRankingEventProduct } from "./hooks/useRankingEventProduct";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Crown,
  MapPin,
  Medal,
  MessageSquare,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { VoteDistribution } from "./components/vote-distributions";
import { RatingComments } from "./components/rating-comments";
import { Separator } from "@/components/ui/separator";



export function RankingProductEvent() {
  const { productEventId } = useParams();
  const { rankingEventProduct, getRanking } = useRankingEventProduct();

  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  useEffect(() => {
    getRanking(Number(productEventId));
  }, [productEventId]);


  if (rankingEventProduct.length === 0) {
    return <div>Cargando...</div>;
  }

  console.log(rankingEventProduct);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="w-10 h-10 text-blue-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Ranking Detallado
            </h1>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Análisis completo con distribución de votos y comentarios de
            usuarios
          </p>

          <div className="flex gap-4 justify-center mt-8">
         
            <Link to="/r4nk1ngh1dd3n">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-full px-6 py-3"
              >
                <Crown className="w-4 h-4" />
                Ver podium
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 rounded-3xl  ring-2 ring-offset-2 ring-yellow-400 bg-gradient-to-r from-yellow-50 to-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {rankingEventProduct.name}
                    </h2>
                    <p className="text-lg text-gray-600">
                      {rankingEventProduct.product.restaurant.name}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                  <div className="aspect-square relative overflow-hidden rounded-2xl shadow-lg group mb-4">
                    <LazyLoadImage
                      src={
                        import.meta.env.VITE_URL_BACK +
                        "imageproduct/" +
                        rankingEventProduct?.image_url
                      }
                      alt={rankingEventProduct?.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= rankingEventProduct.summary.avg_rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="font-bold text-2xl text-gray-900 ml-2">
                        {rankingEventProduct.summary.avg_rating}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                        {rankingEventProduct.reviews.length} votos totales
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Distribución de Votos
                  </h3>
                  <VoteDistribution
                    voteBreakdown={{
                      1: rankingEventProduct.summary.one_star,
                      2: rankingEventProduct.summary.two_star,
                      3: rankingEventProduct.summary.three_star,
                      4: rankingEventProduct.summary.four_star,
                      5: rankingEventProduct.summary.five_star,
                    }}
                    totalVotes={rankingEventProduct.summary.total_reviews}
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Información del Producto
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        {rankingEventProduct.product.description}
                      </p>

                      <Separator />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Todos los Comentarios - {rankingEventProduct.reviews.filter(review => review.comment !== null).length}
                    </h3>
                    <RatingComments comments={rankingEventProduct.reviews.filter(review => review.comment !== null)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

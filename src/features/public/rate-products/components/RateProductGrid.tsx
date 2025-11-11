
import { RateProductCard } from "./RateProductCard"


import type { EventsProduct } from "../../models/EventsProducts";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ConfigurationModel } from "@/features/private/configuration/models/Configuration";

interface RateProductGridProps {
  productsEvents: EventsProduct[]
  configurationEvent: ConfigurationModel[] | null
}


function CartEmpty() {
  return (
    <Card className="flex items-center justify-center h-full border-0 shadow-lg bg-red-200">
      <CardContent>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-600">No hay productos disponibles</p>
          <Link to="/events">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export function RateProductGrid({productsEvents, configurationEvent}: RateProductGridProps) {

  if(productsEvents.length === 0){
    return <CartEmpty />
  }
  console.log(productsEvents)
  return (
    <>
    {
      configurationEvent && (
        <LazyLoadImage src={`${import.meta.env.VITE_URL_RESOURCE}${configurationEvent?.find((config) => config.key === 'topBanner')?.value || ''}`} alt="Evento"   />
      )
    }
    <section className="py-16   ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{productsEvents[0].event.name}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {productsEvents[0].event.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {productsEvents?.map((product:EventsProduct, index) => (
            <div
              key={product.id}
              className="animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RateProductCard
                product={product.restaurant_product}
              
              />
            </div>
          ))}
        </div>
      </div>
    </section>
    {
      configurationEvent && (
        <LazyLoadImage src={`${import.meta.env.VITE_URL_RESOURCE}${configurationEvent?.find((config) => config.key === 'bottomBanner')?.value}`} alt="Evento"  />
      )}
    </>
  );
}

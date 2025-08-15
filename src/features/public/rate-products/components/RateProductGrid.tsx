
import { RateProductCard } from "./RateProductCard"

import { useProductsEvents } from "../../hooks/useProductsEvent";
import type { EventsProduct } from "../../models/EventsProducts";

export function RateProductGrid() {
 const {productsEvents}=useProductsEvents()
 console.log({productsEvents})
  return (
    <section className="py-16   ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Hamburguesas Participantes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre y califica las mejores hamburguesas de la competencia. Tu opinión cuenta para elegir al ganador.
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
  )
}

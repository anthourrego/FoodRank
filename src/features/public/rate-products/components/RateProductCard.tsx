import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import noImage  from '@/assets/no-image.svg'
import {
  MapPin,
  Instagram,
  Facebook,
  User,
  Star,
  ChevronDown,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { StarRating } from "@/components/StarRating";

interface ProductCardProps {
  product: Product;
  showRating?:boolean;
  selected?:boolean
}

export function RateProductCard({ product,showRating=false,selected=false }: ProductCardProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [isSelected, setIsSelected] = useState(selected)
  const [hasVoted, setHasVoted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // Verificar si ya votó por este producto al cargar el componente
  useEffect(() => {
    const votedProducts = JSON.parse(
      localStorage.getItem("x-foodrank-voted-product") || "{}"
    );
    if (votedProducts[product.id]) {
      setAlreadyVoted(true);
      setUserRating(votedProducts[product.id]);
      setHasVoted(true);
    }
  }, [product.id]);

  const handleRate = (rating: number) => {
    if (alreadyVoted) return;
    setUserRating(rating);
  };

  const confirmVote = () => {
    if (alreadyVoted || userRating === 0) return;

    // Guardar el voto en localStorage
    const votedProducts = JSON.parse(
      localStorage.getItem("x-foodrank-voted-product") || "{}"
    );
    votedProducts[product.id] = userRating;
    localStorage.setItem("x-foodrank-voted-product", JSON.stringify(votedProducts));

    setHasVoted(true);
    setAlreadyVoted(true);

    // Aquí podrías enviar la calificación a tu backend
    console.log(`Rated ${product.name} with ${userRating} stars`);
  };



  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full shadow-red-400/30">
      
      <div onClick={()=>setIsSelected(prevState => !prevState)} className="cursor-pointer">
        <div className=" relative overflow-hidden">
          <LazyLoadImage
            src={product?.image_url  ? product.image_url+ "/placeholder.svg" : 'https://www.dolomite.it/_ui/responsive/common/images/no-product-image-available.png' }
            alt={product.name}
            className="aspect-3/2 object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {product.restaurant.restaurant_branches.length} sede
              {product.restaurant.restaurant_branches.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          {alreadyVoted && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-600 hover:bg-green-600 text-white">
                Ya votaste
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="py-3 h-20">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h3>

          {/* Solo mostrar rating si el usuario ya votó */}
          {alreadyVoted && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= product?.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Calificación promedio
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Ver detalles</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSelected ? "rotate-180" : ""}`} />
            </div>
            {
              isSelected && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                <Separator />
                {/* {product.description && product.description.length > 1 && (
                  <>
                    <div className="h-30 overflow-y-auto">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Descripción
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
  
                    <Separator />
                  </>
                )} */}
  
                <div className="">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Información del Restaurante
                  </h4>
  
                  <div className="space-y-4">
                    {/* Sedes */}
                    <div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">
                          Sede
                          {product.restaurant.restaurant_branches.length !== 1 ? "s" : ""}:
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2  overflow-auto h-34">
                        {product.restaurant.restaurant_branches.map((location, index) => (
                          <div className="flex  flex-col   p-2" key={index}>
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs "
                            >
                              {location.city.name || 'nombre sede?'}
                            </Badge>
                            <p className="text-xs text-slate-600 text-balance ml-2">
                              {location.address}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    {/* Direcciones */}
                    {/* <div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">
                          Direccion
                          {product.restaurant.addresses.length !== 1 ? "es" : ""}:
                        </span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {product.restaurant.addresses.map((address, index) => (
                          <div key={index} className="text-sm text-gray-900">
                            • {address}
                          </div>
                        ))}
                      </div>
                    </div> */}
  
                    {/* Propietario */}
                   {/*  <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Propietario:</span>
                      <span className="text-gray-900 font-medium">
                        {product.restaurant.owner}
                      </span>
                    </div> */}
                  </div>
  
                  <div className="flex gap-2 mt-4 relative bottom-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 h-8 bg-transparent"
                    >
                      <Instagram className="w-3 h-3" />
                      <span className="text-xs">
                        {product.restaurant?.socialMedia?.instagram}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 h-8 bg-transparent"
                    >
                      <Facebook className="w-3 h-3" />
                      <span className="text-xs">Facebook</span>
                    </Button>
                  </div>
                </div>
  
                {showRating && (
                  <>
                    <Separator />
                    <div className="bg-gray-50 rounded-lg p-4">
                      {alreadyVoted ? (
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Tu calificación
                          </h4>
                          <div className="flex flex-col items-center gap-3">
                            <StarRating
                              rating={userRating}
                              readonly={true}
                              size="lg"
                              showLabels={true}
                            />
                            <Badge
                              variant="default"
                              className="bg-green-600 hover:bg-green-600"
                            >
                              Ya calificaste esta hamburguesa
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              Diste {userRating} estrella
                              {userRating !== 1 ? "s" : ""} a este producto
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-center">
                            ¿Cómo calificarías esta hamburguesa?
                          </h4>
                          <div className="flex flex-col items-center gap-4">
                            <StarRating
                              rating={userRating}
                              onRate={handleRate}
                              size="lg"
                              showLabels={true}
                            />
                            {userRating > 0 && !hasVoted && (
                              <Button
                                onClick={confirmVote}
                                className="bg-red-600 hover:bg-red-700"
                                size="sm"
                              >
                                Confirmar Calificación
                              </Button>
                            )}
                            {hasVoted && (
                              <div className="text-center">
                                <Badge
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-600"
                                >
                                  ¡Gracias por tu calificación!
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Tu voto de {userRating} estrella
                                  {userRating !== 1 ? "s" : ""} ha sido registrado
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              )
            
            }
           
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Instagram,
  Facebook,
  Star,
  MessageCircleMore,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { StarRating } from "@/components/StarRating";
import type { RestaurantProduct } from "../../models/RestaurantProduct";
import {
  getUniqueDeviceId,
  deviceFingerprint,
  getPublicIp,
} from "@/lib/DeviceFingerprint";
import useGeolocation from "@/hooks/useGeoloation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReviewService } from "../../service/reviewService";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

interface ProductCardProps {
  product: RestaurantProduct;
  showRating?: boolean;
  selected?: boolean;
  eventId?: number | string | null | undefined;
  eventProductId?: number | null | undefined;
  branchId?: number | null | undefined;
}

export function RateProductCard({
  product,
  showRating = false,
  eventId = null,
  eventProductId = null,
  branchId = null,
}: ProductCardProps) {
  const [userRating, setUserRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loadingVoting, setLoadingVoting] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const {
    latitude,
    longitude,
    error: geoError,
    loading: geoLoading,
  } = useGeolocation();
  const navigate = useNavigate();

  // Verificar si ya votó por este producto al cargar el componente
  useEffect(() => {
    const votedProducts = JSON.parse(
      localStorage.getItem("x-foodrank-voted-product") || "{}"
    );
    const entry = votedProducts[product.id];
    if (entry !== undefined) {
      setAlreadyVoted(true);
      const storedRating = typeof entry === "number" ? entry : entry?.rating;
      if (storedRating) {
        setUserRating(storedRating);
      }
      const storedComment =
        typeof entry === "object" ? entry?.comment : undefined;
      if (storedComment) {
        setComment(storedComment);
      }
      setHasVoted(true);
    }
  }, [product.id]);

  useEffect(() => {
    if (!showRating || alreadyVoted) {
      setShowScrollIndicator(false);
      return;
    }

    const checkScrollPosition = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isMobile = window.innerWidth < 768;

      const hasContentBelow = scrollTop + windowHeight < documentHeight - 100;

      setShowScrollIndicator(isMobile && hasContentBelow);
    };

    // Ejecutar inmediatamente
    checkScrollPosition();

    // Ejecutar después de un pequeño delay para asegurar que el contenido esté renderizado
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 100);

    // También ejecutar después de que las imágenes se carguen
    const imageLoadTimeout = setTimeout(() => {
      checkScrollPosition();
    }, 500);

    window.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);
    window.addEventListener("load", checkScrollPosition);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(imageLoadTimeout);
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
      window.removeEventListener("load", checkScrollPosition);
    };
  }, [showRating, alreadyVoted]);

  const handleRate = (rating: number) => {
    if (alreadyVoted) return;
    setUserRating(rating);
  };

  const confirmVote = async () => {
    if (alreadyVoted || userRating === 0) return;

    try {
      setLoadingVoting(true)
      const deviceId = await getUniqueDeviceId();
      const detailed = await deviceFingerprint.getDetailedFingerprint();
      const publicIp = await getPublicIp();

      const deviceInfo = {
        userAgent: detailed.userAgent,
        language: detailed.language,
        platform: detailed.platform,
        screenResolution: detailed.screenResolution,
        colorDepth: detailed.colorDepth,
        pixelRatio: detailed.pixelRatio,
        timezone: detailed.timezone,
        timezoneOffset: detailed.timezoneOffset,
        cookiesEnabled: detailed.cookiesEnabled,
        doNotTrack: detailed.doNotTrack,
        onlineStatus: detailed.onlineStatus,
        hardwareConcurrency: detailed.hardwareConcurrency,
        maxTouchPoints: detailed.maxTouchPoints,
        deviceMemory: detailed.deviceMemory,
        connection: detailed.connection,
        webgl: {
          supported: detailed.webglSupported,
          vendor: detailed.webglVendor,
          renderer: detailed.webglRenderer,
        },
        audioFingerprint: detailed.audioFingerprint,
        ip: publicIp,
        event_product_id: eventProductId,
        event_product_branch_id: branchId
        /* geo: {
          latitude,
          longitude,
          loading: geoLoading,
          error: geoError,
        }, */
      };

      // Guardar el voto en localStorage con datos del dispositivo
      const votedProducts = JSON.parse(
        localStorage.getItem("x-foodrank-voted-product") || "{}"
      );
      votedProducts[product.id] = {
        rating: userRating,
        comment,
        deviceId,
        fingerprint: deviceInfo,
        publicIp,
        votedAt: new Date().toISOString(),
      };

      const reviewService = new ReviewService();
      const result: any = await reviewService.saveReview({
        event_product_id: eventProductId,
        product_id: product.id,
        event_product_branch_id: branchId,
        event_id: eventId,
        rating: userRating,
        comment,
        latitude: latitude,
        longitude: longitude,
        ip: publicIp,
        fingerprint_device: JSON.stringify(deviceInfo),
        deviceId,
      });
      if (result.status === 201) {
        localStorage.setItem(
          "x-foodrank-voted-product",
          JSON.stringify(votedProducts)
        );
        setHasVoted(true);
        setAlreadyVoted(true);
        toast.success("Gracias, " + result.data.message, {
          icon: (
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
          ),
        });
        navigate("/rate-product");
      }
      setLoadingVoting(false)
    } catch (error) {
      setLoadingVoting(false)
      console.warn("Error registrando voto con fingerprint:", error);
    }
    setLoadingVoting(false)
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full shadow-red-400/30">
      <div className="cursor-pointer">
        <div className=" relative overflow-hidden">
          <LazyLoadImage
            src={
              import.meta.env.VITE_URL_BACK +
              "imageproduct/" +
              product?.image_url
            }
            alt={product.name}
            className="aspect-3/2 object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {product.restaurant?.restaurant_branches.length} sede
              {product.restaurant?.restaurant_branches.length !== 1 ? "s" : ""}
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
          <span className="text-sm font-semibold text-gray-500 uppercase">
            {product.restaurant?.name}
          </span>
          <Separator />

          {/* Solo mostrar rating si el usuario ya votó */}
          {/* {alreadyVoted && (
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
          )} */}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Descripción</AccordionTrigger>
                <AccordionContent>
                  {product.description && product.description.length > 1 && (
                    <>
                      <div className="h-30 overflow-y-auto">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <Separator />
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-4 animate-in slide-in-from-top-2">
              <div className="">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Información del Restaurante
                </h4>

                <div className="space-y-4">
                  {/* Sedes */}
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">
                        Sede
                        {product.restaurant?.restaurant_branches.length !== 1
                          ? "s"
                          : ""}
                        :
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2  overflow-auto h-22">
                      {product.restaurant?.restaurant_branches.map(
                        (location, index) => (
                          <div className="flex  flex-col   p-2" key={index}>
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs "
                            >
                              {location.city.name || "nombre sede?"}
                            </Badge>
                            <p className="text-xs text-slate-600 text-balance ml-2">
                              {location.address}
                            </p>
                          </div>
                        )
                      )}
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
                  {product.restaurant?.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 h-8 bg-transparent"
                    >
                      <Instagram className="w-3 h-3 text-pink-500" />

                      <Link
                        to={`https://www.instagram.com/${product.restaurant?.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </Link>
                    </Button>
                  )}
                  {product.restaurant?.facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 h-8 bg-transparent"
                    >
                      <Facebook className="w-3 h-3 text-blue-600" />

                      <Link
                        to={`https://www.facebook.com/${product.restaurant?.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </Link>
                    </Button>
                  )}
                  {product.restaurant?.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 h-8 bg-transparent"
                    >
                      <MessageCircleMore className="w-3 h-3 text-green-500" />
                      <Link
                        to={`https://wa.me/${product.restaurant?.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp
                      </Link>
                    </Button>
                  )}
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
                          {comment && (
                            <div className="max-w-full w-full bg-white rounded-md p-3 border text-left">
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                Tu comentario
                              </p>
                              <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                                {comment}
                              </p>
                            </div>
                          )}
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
                          <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Comentario (opcional)
                            </label>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              disabled={hasVoted}
                              rows={3}
                              className="w-full border rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-70"
                              placeholder="Cuéntanos más sobre tu experiencia..."
                            />
                          </div>
                          {!hasVoted && (
                            loadingVoting ? (
                              <Loader2 className="animate-spin text-red-600" />
                            ) : (
                              <Button
                                onClick={confirmVote}
                                className="bg-red-600 hover:bg-red-700 w-full"
                                size="sm"
                                disabled={
                                  userRating === 0 || alreadyVoted || hasVoted
                                }
                              >
                                Confirmar Calificación
                                <Star
                                  className="fill-yellow-400 text-yellow-400"
                                />
                              </Button>
                            )
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
                              {comment && (
                                <div className="mt-3 max-w-full w-full bg-white rounded-md p-3 border text-left">
                                  <p className="text-xs font-semibold text-gray-700 mb-1">
                                    Tu comentario
                                  </p>
                                  <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                                    {comment}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </div>


      {showScrollIndicator && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-200/40  px-3 py-3 rounded-lg  flex flex-col items-center">
            <div className="relative h-4 w-6 flex flex-col items-center justify-center">

              <ChevronDown
                className="w-5 h-5 text-red-600 absolute cascade-arrow-1"
                strokeWidth={2.5}
              />


              <ChevronDown
                className="w-5 h-5 text-red-500 absolute cascade-arrow-2"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

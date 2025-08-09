import { useNavigate, useParams } from "react-router";
import { RateProductCard } from "../../rate-products/components/RateProductCard";
import { useEffect, useMemo, useState } from "react";

import useGeolocation from "@/hooks/useGeoloation";
import Transform from "@/lib/transform";
import ErrorProduct from "./ErrorProduct";
import NotFoundProduct from "./NotFoundProduct";
import LoadingProduct from "./LoadingProduct";
import { useFilterProductsEvents } from "../../hooks/useFilterProductEvent";
import type { RestaurantProduct } from "../../models/RestaurantProduct";

export interface IDataScan {
  id_event: string;
  id_product: number;
}

function RateProductsVoting() {
  const { productId } = useParams();
  const [product, setProduct] = useState<RestaurantProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    latitude,
    longitude,
    error: errorLocation,
    loading: loadingLocation,
  } = useGeolocation();
  const {filterProductToRate}=useFilterProductsEvents()
  console.log({ latitude, longitude, errorLocation, loadingLocation });

  const dataScan: IDataScan | null = useMemo(() => {
    if (!productId) return null;
    return Transform.decryptJson(productId);
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [dataScan]);

  const fetchData = async () => {
    try {
      if (dataScan) {
        /* const productFind = productsList.find(it => it.id == dataScan.id_product) */
        const productFind =await filterProductToRate(dataScan)
        
        if (productFind) {
          const [eventProduct] = productFind
          const productToRating=eventProduct?.restaurant_product
          setProduct(productToRating);
        } else {
          setError(`Producto con ID ${productId} no encontrado.`);
        }
        /* consultar la api para validar los datos */
      } else {
        setError(`Producto con ID ${productId} no encontrado.`);
      }
    } catch (error) {
      setError(`Producto con ID ${productId} no encontrado.`);
      console.error('Error al consultar la API:', error);
    }
    setLoading(false);
  };
  
  const handleVote = (score: string) => {
    console.log(`Votando por producto ${productId} con puntaje: ${score}`);
    // Aquí enviarías la votación a tu backend
    alert(`¡Gracias por votar por ${product?.name} con ${score} estrellas!`);
    navigate("/rate-product");
  };

  if (loading) {
    return <LoadingProduct />
  }

  if (error) {
    return <ErrorProduct title={error} />;
  }

  if (!product) {
    return <NotFoundProduct />;
  }
  
  return (
    <div className="bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] p-4">

      <div className="max-w-md mx-auto ">
        <RateProductCard product={product} showRating={true} selected={true} />
      </div>
    </div>
  );
}

export default RateProductsVoting;

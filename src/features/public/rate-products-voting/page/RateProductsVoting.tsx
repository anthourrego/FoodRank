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
import type { IDataQr } from "../../qr/GenerateQr";

export interface IDataScan {
  id_event: string;
  id_product: number;
}

function RateProductsVoting() {
  const { productId } = useParams();
  const [product, setProduct] = useState<RestaurantProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventProductId, setEventProductId] = useState<number|null>(null);
  const [branchesRestaurantEvent, setBranchesRestaurentEvent] = useState<any>(null);
  const navigate = useNavigate();

  const { filterProductToRate } = useFilterProductsEvents()
  

  const dataScan: IDataQr | null = useMemo(() => {
    if (!productId) return null;
    return Transform.decryptJson(productId);
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [dataScan]);

  const fetchData = async () => {
    try {
      if (dataScan) {
        const productFind = await filterProductToRate(dataScan)

        if (productFind) {
          const [eventProduct] = productFind
          const productToRating = eventProduct?.restaurant_product
          const branchEventProductId = eventProduct?.branchs_product.find((bp: any) => bp.restaurant_branch_id == dataScan.branch_id)?.id
          
          setBranchesRestaurentEvent(branchEventProductId)
          setProduct(productToRating);
          setEventProductId(eventProduct.id)
        } else {
          setError(`Producto con ID ${productId} no encontrado.`);
        }
      } else {
        setError(`Producto con ID ${productId} no encontrado.`);
      }
    } catch (error) {
      setError(`Producto con ID ${productId} no encontrado.`);
      console.error('Error al consultar la API:', error);
    }
    setLoading(false);
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
        <RateProductCard product={product} showRating={true} selected={true} eventId={dataScan?.event_id} eventProductId={eventProductId} branchId={branchesRestaurantEvent}  />
      </div>
    </div>
  );
}

export default RateProductsVoting;

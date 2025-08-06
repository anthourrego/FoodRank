import { useNavigate, useParams } from "react-router";
import { RateProductCard } from "../../rate-products/components/RateProductCard";
import { useEffect, useState } from "react";
import { productsList } from "@/models/products";
import useGeolocation from "@/hooks/useGeoloation";

function RateProductsVoting() {
  const { productId } = useParams(); // Obtiene el productId de la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    latitude,
    longitude,
    error: errorLocation,
    loading: loadingLocation,
  } = useGeolocation();
  console.log({ latitude, longitude, errorLocation, loadingLocation });

  useEffect(() => {
    if (!productId) {
      // Si por alguna razón no hay productId, podrías redirigir o mostrar un error
      setError("ID de producto no proporcionado.");
      setLoading(false);
      return;
    }


    // Simulación de carga de datos
    setTimeout(() => {
      if (productId === "123") {
        // Ejemplo con un ID de producto
        setProduct(productsList[0]);
      } else {
        setError(`Producto con ID ${productId} no encontrado.`);
      }
      setLoading(false);
    }, 1000);
  }, [productId]); // Vuelve a cargar si el productId cambia

  const handleVote = (score) => {
    console.log(`Votando por producto ${productId} con puntaje: ${score}`);
    // Aquí enviarías la votación a tu backend
    alert(`¡Gracias por votar por ${product?.name} con ${score} estrellas!`);
    navigate("/rate-product"); 
  };
  if (loading) {
    return <p>Cargando detalles del producto...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!product) {
    return <p>Producto no encontrado.</p>;
  }

  return (
    <div className="bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] p-4">

    <div className="max-w-md mx-auto ">
      <RateProductCard product={product} showRating={true} selected={true}/>
    </div>
    </div>
  );
}

export default RateProductsVoting;

import { Loader } from "lucide-react";

function LoadingProduct() {
    return (
        <div className="m-5 p-5 rounded-lg flex items-center flex-col gap-2">
            <div>
                <Loader className="animate-spin text-red-600" size={40} />
            </div>
            <div>
                <p className="text-red-800 text-center">Cargando detalles del producto...</p>
            </div>
        </div>
    );
}

export default LoadingProduct;

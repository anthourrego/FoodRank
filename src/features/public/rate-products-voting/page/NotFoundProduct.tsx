interface NotFoundProductProps { }

function NotFoundProduct({ }: NotFoundProductProps) {
    return (
        <div className="bg-yellow-300/20 border border-yellow-400 m-5 p-5 rounded-lg">
            <p className="text-yellow-800 text-center">
                Producto no encontrado.
            </p>
        </div>
    );
}

export default NotFoundProduct;

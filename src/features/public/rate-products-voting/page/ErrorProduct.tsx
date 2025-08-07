interface ErrorProductProps {
    title: string;
}

function ErrorProduct({ title }: ErrorProductProps) {
    return (
        <div className="bg-red-300/20 border border-red-600 m-5 p-5 rounded-lg">
            <p className="text-red-800 text-center">
                <span className="font-semibold">Error: </span>
                {title}
            </p>
        </div>
    );
}

export default ErrorProduct;

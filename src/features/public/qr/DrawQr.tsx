import QRCode from "react-qr-code";
import ActionsQr from "./ActionsQr";
import { useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import Transform from "@/lib/transform";

const URLPAGE = "http://localhost:5173/#/rate-product";

interface DrawQrProps {
    titleShare: string;
    descriptionShare: string;
    dataQr: { [key: string]: string }
}

const DrawQr = ({ dataQr, descriptionShare, titleShare }: DrawQrProps) => {

    const qrRef = useRef<HTMLDivElement | null>(null);

    const urlQr = useMemo(() => {
        return `${URLPAGE}/${Transform.encryptJson(dataQr)}`;
    }, [dataQr])

    console.log(urlQr)

    const handleDownload = () => {
        if (!qrRef.current) return;

        toPng(qrRef.current, { cacheBust: true, backgroundColor: "#ffffff" })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = new Date().toTimeString() + ".png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("Error exportando el QR:", err);
            });
    };

    return (
        <>
            <div className="flex justify-center">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative bg-white p-4 rounded-lg shadow-lg" ref={qrRef}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={urlQr}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </div>
            </div>

            <ActionsQr urlShare={urlQr} descriptionShare={descriptionShare} titleShare={titleShare} handleDownload={handleDownload} />
        </>
    );
};

export default DrawQr;

import { toPng } from "html-to-image";
import { useMemo, useRef } from "react";
import ActionsQr from "./ActionsQr";
import QRCode from "react-qr-code";
import Transform from "@/lib/transform";
import type { IDataQr } from "./GenerateQr";
import { useLocation } from "react-router";


const URLPAGE = import.meta.env.VITE_URL_FRONT;

interface DrawQrProps {
    titleShare: string;
    descriptionShare: string;
    dataQr: IDataQr
}

const DrawQr = ({ dataQr, descriptionShare, titleShare }: DrawQrProps) => {

    const qrRef = useRef<HTMLDivElement | null>(null);

    const urlQr = useMemo(() => {
        return `${URLPAGE}rate-product/${Transform.encryptJson(dataQr)}`;
    }, [dataQr]);

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

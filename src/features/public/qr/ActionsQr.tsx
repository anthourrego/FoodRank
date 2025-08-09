import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2 } from 'lucide-react';

interface ActionsQrProps {
    titleShare: string;
    descriptionShare: string;
    urlShare: string;
    handleDownload: () => void;
}

const ActionsQr = ({ urlShare, descriptionShare, titleShare, handleDownload }: ActionsQrProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(urlShare);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: titleShare,
                    text: descriptionShare,
                    url: urlShare,
                });
            } catch (err) {
                console.error('Error al compartir:', err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="grid grid-cols-1 gap-2">
            {/* <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
                <Copy className="w-4 h-4" />
                <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
            </Button> */}

            <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
            >
                <Download className="w-4 h-4" />
                <span className="text-xs">Descargar</span>
            </Button>

            {/* <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-purple-50 hover:border-purple-200 transition-colors"
            >
                <Share2 className="w-4 h-4" />
                <span className="text-xs">Compartir</span>
            </Button> */}
        </div>
    );
};

export default ActionsQr;

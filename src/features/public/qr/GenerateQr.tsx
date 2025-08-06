import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import DrawQr from './DrawQr';

interface GenerateQrProps {
    titleShare: string;
    descriptionShare: string;
    dataQr: { [key: string]: string }
}

const GenerateQr = ({ dataQr, descriptionShare, titleShare }: GenerateQrProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {titleShare}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mt-2">{descriptionShare}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <DrawQr dataQr={dataQr} descriptionShare={descriptionShare} titleShare={titleShare} />
                </CardContent>
            </Card>
        </div>
    );
};

export default GenerateQr;

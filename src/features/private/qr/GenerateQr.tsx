import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { useState } from "react";
import DrawQr from "./DrawQr";
import SelectsField from "./SelectsField";

export interface IDataQr {
  product_id: string;
  event_id: string;
  branch_id: string;
}

const GenerateQr = () => {
  const [dataQr, setDataQr] = useState<IDataQr>();

  const generateQr = (val: IDataQr | undefined) => {
    setDataQr(val);
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <SelectsField generateQr={generateQr} />

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Vota por tu producto favorito
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">Escanea el QR</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {dataQr && (
            <DrawQr
              dataQr={dataQr}
              descriptionShare={"Escanea el QR"}
              titleShare={"Vota por tu producto favorito"}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateQr;

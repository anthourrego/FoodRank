import { Loader2 } from "lucide-react";

export const Loading = ({ className, classNameLoader }: { className?: string, classNameLoader?: string }) => (
  <div className={className}>
    <Loader2 className={"animate-spin text-red-800 " + classNameLoader} />
  </div>
);

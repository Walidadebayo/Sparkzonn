import { Loader2 } from "lucide-react";

export default function Loading() {
  return <div className="grid place-items-center h-full">
    <Loader2 className="animate-spin h-10 w-10 text-muted-foreground" />
  </div>
}

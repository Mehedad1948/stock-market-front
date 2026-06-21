import { getStockAnalysis } from "@/services/http/signales.service";

export default async function CardSignals() {
    const res = await getStockAnalysis()
    return (
        <div>
            
        </div>
    );
}
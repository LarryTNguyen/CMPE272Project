import React, { useState, useEffect } from "react";
import supabase from '../services/superbase';
import Navbar from "../components/Navbar";

const PortfolioCard = (props) => {
    const [stock, setStock] = useState(null)
    const [calculations, setCalculations] = useState({
        return: 0,
        percChange: 0,
        marketValue: 0,

    })

    useEffect(() => {

        const fetchStock = async () => {
            const { data, error } = await supabase
                .from("stock_data")
                .select("*")
                .eq("ticker", props.ticker)
                .single();

            setStock(data)
            const purchaseValue = props.price;
            const currentValue = data.current_price;
            setCalculations({
                return: (currentValue - purchaseValue) * props.quantity,
                percChange: ((currentValue - purchaseValue) / purchaseValue) * 100,
                marketValue: currentValue * props.quantity,
            });
        }

        fetchStock();
    }, [props.ticker, props.price, props.quantity]);
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-200 flex justify-between items-center w-full max-w-2xl mx-auto">

            <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold tracking-wide text-gray-800">{props.ticker}</div>
                <div className="text-sm text-gray-500">
                    Quantity: <span className="text-gray-700 font-medium">{props.quantity}</span>
                </div>
                <div className="text-sm text-gray-500">
                    Purchase Price: <span className="text-gray-700 font-medium">${props.price}</span>
                </div>
                <div className="text-sm text-gray-500">
                    Current Price: <span className="text-gray-700 font-medium">${stock?.current_price?.toFixed(2) ?? "—"}</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className={`text-sm font-semibold ${calculations.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Return: ${calculations.return.toFixed(2)}
                </div>
                <div className={`text-sm font-semibold ${calculations.percChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Change: {calculations.percChange.toFixed(2)}%
                </div>
                <div className="text-lg font-bold text-gray-800">
                    Market Value: ${calculations.marketValue.toFixed(2)}
                </div>
            </div>
        </div>
    )

}
export default PortfolioCard
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyOrders, updateOrderStatus } from "../services/orderApi";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getMyOrders();
            if (data?.orders) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Fetch orders error:", err);
            setError(err.response?.data?.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAdvanceStatus = async (orderId, currentStatus) => {
        const statusMap = {
            PLACED: "CONFIRMED",
            CONFIRMED: "SHIPPED",
            SHIPPED: "DELIVERED",
        };

        const nextStatus = statusMap[currentStatus];
        if (!nextStatus) return;

        setUpdatingOrderId(orderId);
        try {
            const res = await updateOrderStatus(orderId, nextStatus);
            if (res.success && res.order) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? res.order : o))
                );
            }
        } catch (err) {
            console.error("Status update error:", err);
            alert(err.response?.data?.message || "Could not update status.");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "DELIVERED":
                return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60";
            case "SHIPPED":
                return "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60";
            case "CONFIRMED":
                return "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60";
            case "PLACED":
                return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700";
            case "PENDING_PAYMENT":
                return "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60";
            default:
                return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700";
        }
    };

    const getProgressionStep = (status) => {
        const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
        return steps.indexOf(status);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Orders</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                            Track shipments and review payment receipts.
                        </p>
                    </div>
                    {!loading && orders.length > 0 && (
                        <button
                            onClick={fetchOrders}
                            className="self-start sm:self-auto text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
                        >
                            Refresh
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                        <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-emerald-600 rounded-full animate-spin mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 font-medium text-xs">Loading orders...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/60 p-6 shadow-xs">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Failed to load orders</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-4 text-xs">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-8 shadow-xs">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mb-3">
                            📦
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No orders yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-5 text-xs">
                            You haven't placed any orders with ShopKart yet.
                        </p>
                        <Link
                            to="/products"
                            className="bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-5">
                        {orders.map((order) => {
                            const stepIndex = getProgressionStep(order.status);

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden"
                                >
                                    <div className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                                                    Order #{order._id.slice(-8)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {stepIndex !== -1 && (
                                        <div className="px-5 pt-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between max-w-md mx-auto">
                                                {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map((st, idx) => {
                                                    const isCompleted = idx <= stepIndex;
                                                    const isCurrent = idx === stepIndex;

                                                    return (
                                                        <div key={st} className="flex-1 flex flex-col items-center relative">
                                                            <div
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition z-10 ${
                                                                    isCurrent
                                                                        ? "bg-slate-900 dark:bg-emerald-600 text-white ring-2 ring-emerald-500"
                                                                        : isCompleted
                                                                        ? "bg-emerald-600 dark:bg-emerald-500 text-white"
                                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                                                                }`}
                                                            >
                                                                {isCompleted ? "✓" : idx + 1}
                                                            </div>
                                                            <span
                                                                className={`text-[9px] mt-1 font-semibold uppercase tracking-wider ${
                                                                    isCurrent ? "text-slate-900 dark:text-white" : isCompleted ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                                                                }`}
                                                            >
                                                                {st}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {stepIndex < 3 && (
                                                <div className="text-center mt-3">
                                                    <button
                                                        onClick={() => handleAdvanceStatus(order._id, order.status)}
                                                        disabled={updatingOrderId === order._id}
                                                        className="text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-0.5 rounded-md transition cursor-pointer"
                                                    >
                                                        {updatingOrderId === order._id ? "Updating..." : `Advance to ${["CONFIRMED", "SHIPPED", "DELIVERED"][stepIndex + 1]}`}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                                                <div className="flex items-center space-x-3 min-w-0 pr-4">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/images/products/placeholder.svg";
                                                        }}
                                                    />
                                                    <div className="truncate">
                                                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-slate-500 dark:text-slate-400">
                                                            Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="font-semibold text-slate-900 dark:text-white flex-shrink-0">
                                                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-slate-50/70 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                                        <div className="text-slate-500 dark:text-slate-400">
                                            <span>To: </span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                                            </span>

                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
                                            >
                                                Receipt
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

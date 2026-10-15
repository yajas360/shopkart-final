import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOrderById, updateOrderStatus } from "../services/orderApi";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchDetails = async () => {
            try {
                const data = await getOrderById(id);
                if (!cancelled) {
                    if (data?.order) {
                        setOrder(data.order);
                    } else {
                        setError("Order not found");
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.response?.data?.message || "Could not retrieve order details.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchDetails();
        }

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleAdvanceStatus = async () => {
        if (!order || updating) return;

        const progression = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
        const currentIndex = progression.indexOf(order.status);
        if (currentIndex === -1 || currentIndex >= progression.length - 1) return;

        const nextStatus = progression[currentIndex + 1];
        setUpdating(true);

        try {
            const res = await updateOrderStatus(order._id, nextStatus);
            if (res.success) {
                setOrder(res.order);
            }
        } catch (err) {
            alert("Error updating status: " + (err.response?.data?.message || err.message));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
                <Navbar />
                <div className="flex-1 flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
                <Navbar />
                <main className="max-w-md mx-auto px-6 py-20 text-center flex-1">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Order Not Found</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">{error || "Could not retrieve order details."}</p>
                    <Link
                        to="/orders"
                        className="bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-semibold transition"
                    >
                        Back to My Orders
                    </Link>
                </main>
            </div>
        );
    }

    const progression = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
    const currentStepIndex = progression.indexOf(order.status);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full">
                <div className="mb-4 flex items-center justify-between text-xs">
                    <Link
                        to="/orders"
                        className="font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1"
                    >
                        &larr; Back to Orders
                    </Link>
                    <span className="text-slate-400 dark:text-slate-500 font-mono">ID: {order._id}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Order #{order._id.slice(-8)}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                            <span className="font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                {order.status}
                            </span>
                            <span className="font-semibold px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {currentStepIndex !== -1 && (
                        <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                {progression.map((st, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;

                                    return (
                                        <div key={st} className="flex-1 flex flex-col items-center">
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition z-10 ${
                                                    isCurrent
                                                        ? "bg-slate-900 dark:bg-emerald-600 text-white ring-2 ring-emerald-500"
                                                        : isCompleted
                                                        ? "bg-emerald-600 dark:bg-emerald-500 text-white"
                                                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
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

                            {currentStepIndex < 3 && (
                                <div className="text-center mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                                    <button
                                        onClick={handleAdvanceStatus}
                                        disabled={updating}
                                        className="text-[11px] font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded-md transition cursor-pointer"
                                    >
                                        {updating ? "Updating..." : `Advance status to ${progression[currentStepIndex + 1]}`}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <h2 className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Shipping Address
                            </h2>
                            <p className="font-semibold text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</p>
                            <p className="text-slate-600 dark:text-slate-400 mt-0.5">{order.shippingAddress?.addressLine1}</p>
                            <p className="text-slate-600 dark:text-slate-400">
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono">Contact: {order.shippingAddress?.phone}</p>
                        </div>

                        <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <h2 className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Payment Details
                            </h2>
                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Gateway</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">Razorpay (Test Mode)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">{order.paymentStatus}</span>
                                </div>
                                {order.razorpayPaymentId && (
                                    <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700">
                                        <span className="text-slate-400 dark:text-slate-500 block">Payment ID:</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-300 break-all">{order.razorpayPaymentId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                            Items ({order.items?.length})
                        </h2>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white dark:bg-slate-900">
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
                                            <p className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                                            <p className="text-slate-500 dark:text-slate-400">
                                                ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity} units
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-white flex-shrink-0">
                                        ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Shipping: <span className="font-semibold text-emerald-700 dark:text-emerald-300">FREE</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Total:</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

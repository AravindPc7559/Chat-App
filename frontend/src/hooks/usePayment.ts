import { useState } from "react";
import toast from "react-hot-toast";
import { PaymentPlan } from "../types";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface OrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    error?: string;
}

interface VerifyResponse {
    success: boolean;
    message: string;
    error?: string;
}

const usePayment = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (planType: "basic" | "pro" | "enterprise"): Promise<void> => {
        setLoading(true);
        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error("Failed to load Razorpay script");
            }

            // Create order
            console.log("Creating order for plan:", planType);
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ planType }),
            });

            console.log("Order response status:", orderRes.status);

            const orderData: OrderResponse = await orderRes.json();
            console.log("Order response data:", orderData);

            if (!orderRes.ok) {
                const errorMsg = orderData.error || `Failed to create order: ${orderRes.statusText}`;
                console.error("Order creation failed:", errorMsg);
                throw new Error(errorMsg);
            }

            if (orderData.error) {
                throw new Error(orderData.error);
            }

            if (!orderData.orderId || !orderData.keyId) {
                console.error("Invalid order response:", orderData);
                throw new Error("Invalid response from server. Missing orderId or keyId.");
            }

            // Initialize Razorpay
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "ChatHub",
                description: `Payment for ${planType} plan`,
                order_id: orderData.orderId,
                handler: async function (response: RazorpayResponse) {
                    try {
                        // Verify payment
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planType: planType,
                            }),
                        });

                        if (!verifyRes.ok) {
                            const errorData: VerifyResponse = await verifyRes.json();
                            throw new Error(errorData.error || `Payment verification failed: ${verifyRes.statusText}`);
                        }

                        const verifyData: VerifyResponse = await verifyRes.json();

                        if (verifyData.error) {
                            throw new Error(verifyData.error);
                        }

                        toast.success("Payment successful! Your plan has been activated.");
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        const errorMessage = error instanceof Error ? error.message : "Payment verification failed";
                        toast.error(errorMessage);
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                theme: {
                    color: "#6366f1",
                },
                modal: {
                    ondismiss: function () {
                        toast.error("Payment cancelled");
                        setLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);
        } catch (error) {
            console.error("Payment error:", error);
            const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
            toast.error(errorMessage, { duration: 5000 });
            setLoading(false);
        }
    };

    return { loading, handlePayment };
};

export default usePayment;


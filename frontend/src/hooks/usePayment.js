import { useState } from "react";
import toast from "react-hot-toast";

const usePayment = () => {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = () => {
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

    const handlePayment = async (planType) => {
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
                credentials: "include", // Include cookies for authentication
                body: JSON.stringify({ planType }),
            });

            console.log("Order response status:", orderRes.status);

            const orderData = await orderRes.json();
            console.log("Order response data:", orderData);

            if (!orderRes.ok) {
                const errorMsg = orderData.error || orderData.details || `Failed to create order: ${orderRes.statusText}`;
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
                name: "ChatApp",
                description: `Payment for ${planType} plan`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include", // Include cookies for authentication
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planType: planType,
                            }),
                        });

                        if (!verifyRes.ok) {
                            const errorData = await verifyRes.json();
                            throw new Error(errorData.error || `Payment verification failed: ${verifyRes.statusText}`);
                        }

                        const verifyData = await verifyRes.json();

                        if (verifyData.error) {
                            throw new Error(verifyData.error);
                        }

                        toast.success("Payment successful! Your plan has been activated.");
                        // You can redirect or refresh here
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error(error.message || "Payment verification failed");
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
            const errorMessage = error.message || "Payment failed. Please try again.";
            toast.error(errorMessage, { duration: 5000 });
            setLoading(false);
        }
    };

    return { loading, handlePayment };
};

export default usePayment;


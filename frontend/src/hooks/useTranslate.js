import { useState } from "react";
import toast from "react-hot-toast";

const useTranslate = () => {
    const [loading, setLoading] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);

    const translate = async (text) => {
        setLoading(true);
        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            const textResponse = await res.text();
            console.log("Raw response:", textResponse);

            if (!textResponse) {
                throw new Error("Empty response from server");
            }

            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                console.error("JSON parse error:", e);
                throw new Error("Server returned invalid JSON: " + textResponse.substring(0, 100));
            }

            if (data.error) {
                // Check if it's a credit expired error
                if (res.status === 402 || res.status === 401 || data.code === "CREDIT_EXPIRED") {
                    setShowCreditModal(true);
                    return null;
                }
                // Check error message for API key or credit related issues
                const errorMsg = data.error.toLowerCase();
                if (errorMsg.includes("api key") || errorMsg.includes("credit") || errorMsg.includes("quota") || errorMsg.includes("billing")) {
                    setShowCreditModal(true);
                    return null;
                }
                throw new Error(data.error);
            }

            return data.translatedText;
        } catch (error) {
            console.error("Translation error:", error);
            // Check if it's a credit/API error
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes("credit") || 
                errorMsg.includes("quota") || 
                errorMsg.includes("billing") || 
                errorMsg.includes("api key") ||
                errorMsg.includes("incorrect api key") ||
                errorMsg.includes("invalid api key")) {
                setShowCreditModal(true);
            } else {
                toast.error(error.message);
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, translate, showCreditModal, setShowCreditModal };
};

export default useTranslate;

import { useState } from "react";
import toast from "react-hot-toast";

const useTranslate = () => {
    const [loading, setLoading] = useState(false);

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
                throw new Error(data.error);
            }

            return data.translatedText;
        } catch (error) {
            console.error("Translation error:", error);
            toast.error(error.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, translate };
};

export default useTranslate;

export const translateToEnglish = async (req, res) => {
    console.log("translateToEnglish called with text:", req.body.text);
    try {
        const { text } = req.body;

        if (!text) {
            console.log("No text provided");
            return res.status(400).json({ error: "Text is required" });
        }

        if (!process.env.OPENAI_API_KEY) {
            console.log("No API key");
            return res.status(500).json({ error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file." });
        }

        console.log("Importing OpenAI...");
        // Dynamic import to avoid crash if openai package is not installed
        const { default: OpenAI } = await import("openai");
        console.log("OpenAI imported");

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        console.log("Calling OpenAI API...");
        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a translator. Translate the given text to English. If the text is already in English, return it as is. Only return the translated text, nothing else."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 500,
            });
        } catch (apiError) {
            // Re-throw OpenAI API errors to be caught by outer catch
            throw apiError;
        }

        const translatedText = completion.choices[0].message.content.trim();
        console.log("Translation success:", translatedText);

        res.status(200).json({ translatedText });
    } catch (error) {
        console.error("Error in translateToEnglish: ", error.message);
        console.error("Full error:", error);
        
        // Check for credit/quota/API key related errors
        const errorMessage = (error.message || '').toLowerCase();
        const errorStatus = error.status || error.response?.status || error.statusCode || error.code;
        
        // Check OpenAI error structure
        const openAIError = error.error || error.response?.data || {};
        const openAIErrorCode = openAIError.code || openAIError.type || '';
        const openAIErrorMsg = (openAIError.message || '').toLowerCase();
        
        const isCreditError = 
            errorMessage.includes('insufficient_quota') ||
            errorMessage.includes('quota') ||
            errorMessage.includes('billing') ||
            errorMessage.includes('credit') ||
            errorMessage.includes('payment') ||
            errorMessage.includes('api key') ||
            errorMessage.includes('incorrect api key') ||
            errorMessage.includes('invalid api key') ||
            errorMessage.includes('401') ||
            openAIErrorMsg.includes('api key') ||
            openAIErrorMsg.includes('incorrect api key') ||
            openAIErrorMsg.includes('invalid api key') ||
            openAIErrorCode === 'invalid_api_key' ||
            openAIErrorCode === 'insufficient_quota' ||
            errorStatus === 429 || // Rate limit
            errorStatus === 402 || // Payment required
            errorStatus === 401 || // Unauthorized (invalid API key)
            error.code === 401; // OpenAI error code
        
        if (isCreditError) {
            return res.status(402).json({ 
                error: "Translation failed: Credit is over",
                code: "CREDIT_EXPIRED"
            });
        }
        
        res.status(500).json({ error: `Translation failed: ${error.message}` });
    }
};

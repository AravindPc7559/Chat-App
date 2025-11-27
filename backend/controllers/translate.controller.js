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
        const completion = await openai.chat.completions.create({
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

        const translatedText = completion.choices[0].message.content.trim();
        console.log("Translation success:", translatedText);

        res.status(200).json({ translatedText });
    } catch (error) {
        console.error("Error in translateToEnglish: ", error.message);
        res.status(500).json({ error: `Translation failed: ${error.message}` });
    }
};

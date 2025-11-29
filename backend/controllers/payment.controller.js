import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance (only if keys are available)
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

// Plan configurations
const PLANS = {
    basic: {
        name: "Basic",
        amount: 999, // Amount in paise (₹9.99)
        currency: "INR",
        credits: 100,
    },
    pro: {
        name: "Pro",
        amount: 1999, // Amount in paise (₹19.99)
        currency: "INR",
        credits: 500,
    },
    enterprise: {
        name: "Enterprise",
        amount: 4999, // Amount in paise (₹49.99)
        currency: "INR",
        credits: -1, // -1 means unlimited
    },
};

// Create Razorpay order
export const createOrder = async (req, res) => {
    try {
        // Check if Razorpay keys are configured (check at runtime)
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (!keyId || !keySecret) {
            console.error("Razorpay keys missing:", {
                hasKeyId: !!keyId,
                hasKeySecret: !!keySecret,
                keyIdLength: keyId?.length || 0,
                keySecretLength: keySecret?.length || 0
            });
            return res.status(500).json({ 
                error: "Razorpay keys not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file and restart the server." 
            });
        }

        // Initialize Razorpay if not already initialized or if keys changed
        if (!razorpay || razorpay.key_id !== keyId) {
            razorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
        }

        const { planType } = req.body;
        const userId = req.user._id;

        if (!planType || !PLANS[planType]) {
            return res.status(400).json({ error: "Invalid plan type" });
        }

        const plan = PLANS[planType];

        // Generate a shorter receipt (max 40 chars for Razorpay)
        const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
        const userIdShort = userId.toString().slice(-8); // Last 8 chars of user ID
        const receipt = `rcpt_${userIdShort}_${timestamp}`; // Max length: 5 + 8 + 1 + 8 = 22 chars

        const options = {
            amount: plan.amount,
            currency: plan.currency,
            receipt: receipt,
            notes: {
                userId: userId.toString(),
                planType: planType,
                credits: plan.credits,
            },
        };

        console.log("Creating Razorpay order with options:", {
            amount: options.amount,
            currency: options.currency,
            receipt: options.receipt,
            planType: planType
        });

        let order;
        try {
            order = await razorpay.orders.create(options);
        } catch (razorpayError) {
            console.error("Razorpay API Error:", razorpayError);
            // Razorpay errors have a specific structure
            if (razorpayError.error) {
                throw new Error(razorpayError.error.description || razorpayError.error.reason || "Razorpay API error");
            }
            throw razorpayError;
        }

        console.log("Order created successfully:", order.id);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error in createOrder: ", error);
        console.error("Error details:", {
            message: error.message,
            description: error.description,
            statusCode: error.statusCode,
            error: error.error,
            stack: error.stack
        });
        
        // Extract meaningful error message
        let errorMessage = "Failed to create order";
        if (error.error?.description) {
            errorMessage = error.error.description;
        } else if (error.description) {
            errorMessage = error.description;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        res.status(500).json({ 
            error: errorMessage,
            details: error.error?.field || "Please check your Razorpay configuration and ensure your keys are valid"
        });
    }
};

// Verify payment
export const verifyPayment = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ error: "Razorpay secret key not configured" });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;
        const userId = req.user._id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planType) {
            return res.status(400).json({ 
                error: "Missing payment details",
                details: "All payment details (order_id, payment_id, signature, planType) are required"
            });
        }

        if (!PLANS[planType]) {
            return res.status(400).json({ error: `Invalid plan type: ${planType}` });
        }

        // Create signature
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest("hex");

        // Verify signature
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ error: "Payment verification failed" });
        }

        // Payment verified successfully
        const plan = PLANS[planType];

        // Here you would typically:
        // 1. Update user's subscription/plan in database
        // 2. Add credits to user account
        // 3. Store payment record
        // 4. Send confirmation email

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            planType: planType,
            credits: plan.credits,
            paymentId: razorpay_payment_id,
        });
    } catch (error) {
        console.error("Error in verifyPayment: ", error.message);
        res.status(500).json({ error: "Payment verification failed" });
    }
};

// Test Razorpay configuration
export const testRazorpayConfig = async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (!keyId || !keySecret) {
            return res.status(500).json({ 
                error: "Razorpay keys not configured",
                hasKeyId: !!keyId,
                hasKeySecret: !!keySecret
            });
        }

        // Try to initialize Razorpay
        try {
            const testRazorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
            
            // Try to fetch account details to verify keys work
            // This is a simple test to see if keys are valid
            res.status(200).json({
                success: true,
                message: "Razorpay keys are configured",
                keyIdLength: keyId.length,
                keySecretLength: keySecret.length,
                keyIdPrefix: keyId.substring(0, 8) + "..."
            });
        } catch (initError) {
            return res.status(500).json({
                error: "Failed to initialize Razorpay",
                details: initError.message
            });
        }
    } catch (error) {
        console.error("Error in testRazorpayConfig: ", error);
        res.status(500).json({ error: "Configuration test failed" });
    }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (!keyId || !keySecret) {
            return res.status(500).json({ error: "Razorpay keys not configured" });
        }

        // Initialize Razorpay if not already initialized
        if (!razorpay || razorpay.key_id !== keyId) {
            razorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
        }

        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        const order = await razorpay.orders.fetch(orderId);

        res.status(200).json({
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Error in getPaymentStatus: ", error.message);
        res.status(500).json({ error: "Failed to fetch payment status" });
    }
};


import { Link, useNavigate } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";
import usePayment from "../../hooks/usePayment";
import toast from "react-hot-toast";

interface Plan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
    color: string;
    planType: "basic" | "pro" | "enterprise";
}

const Plans = () => {
    const { authUser } = useAuthContext();
    const navigate = useNavigate();
    const { loading, handlePayment } = usePayment();

    const plans: Plan[] = [
        {
            name: "Basic",
            price: "$9.99",
            period: "per month",
            description: "Perfect for casual users",
            features: [
                "100 translation credits/month",
                "Basic support",
                "Standard translation speed",
                "English translation only"
            ],
            popular: false,
            color: "from-gray-500 to-gray-600",
            planType: "basic"
        },
        {
            name: "Pro",
            price: "$19.99",
            period: "per month",
            description: "Best for regular users",
            features: [
                "500 translation credits/month",
                "Priority support",
                "Fast translation speed",
                "Multiple language support",
                "Translation history"
            ],
            popular: true,
            color: "from-indigo-600 to-purple-600",
            planType: "pro"
        },
        {
            name: "Enterprise",
            price: "$49.99",
            period: "per month",
            description: "For power users and teams",
            features: [
                "Unlimited translation credits",
                "24/7 premium support",
                "Ultra-fast translation",
                "All languages supported",
                "Translation history",
                "API access",
                "Custom integrations"
            ],
            popular: false,
            color: "from-purple-600 to-pink-600",
            planType: "enterprise"
        }
    ];

    const handlePlanSelect = async (planType: "basic" | "pro" | "enterprise") => {
        if (!authUser) {
            toast.error("Please login to continue");
            navigate("/login");
            return;
        }

        await handlePayment(planType);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-16">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                        Select the perfect plan for your translation needs. All plans include our advanced AI-powered translation service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative transform transition-all hover:scale-[1.02] ${
                                plan.popular ? "ring-4 ring-indigo-200 md:scale-105" : ""
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm mb-4">{plan.description}</p>
                                <div className="mb-2">
                                    <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-600 ml-2 text-sm sm:text-base">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 min-h-[200px]">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                        <IoCheckmarkCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePlanSelect(plan.planType)}
                                disabled={loading}
                                className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                    plan.popular
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    plan.popular ? "Get Started" : "Choose Plan"
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mb-8 sm:mb-12">
                    <Link
                        to={authUser ? "/" : "/login"}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base"
                    >
                        ← Back to {authUser ? "Chat" : "Login"}
                    </Link>
                </div>

                <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">What happens if I exceed my credits?</h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                You'll be notified when you're running low on credits. You can upgrade your plan at any time to get more credits.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Can I change plans later?</h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Do credits roll over?</h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                Unused credits from your current month will roll over to the next month, up to a maximum limit.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Is there a free trial?</h3>
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                Yes! All new users get 10 free translation credits to try out our service before subscribing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Plans;


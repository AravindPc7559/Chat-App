import { useNavigate } from "react-router-dom";
import { IoClose, IoWarning } from "react-icons/io5";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface CreditExpiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreditExpiredModal = ({ isOpen, onClose }: CreditExpiredModalProps) => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleRenew = () => {
        onClose();
        navigate("/plans");
    };

    const modalContent = (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                zIndex: 9999
            }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200 max-h-[90vh] overflow-y-auto"
                style={{ 
                    margin: 'auto',
                    position: 'relative',
                    zIndex: 10000
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <IoWarning className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Credit Expired</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <IoClose className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Your translation credits have been exhausted. To continue using the translation feature, please renew your plan.
                    </p>
                    
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">💡</span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Upgrade your plan to get more translation credits and unlock premium features.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-5 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleRenew}
                            className="flex-1 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            Renew Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default CreditExpiredModal;


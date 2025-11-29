interface GenderCheckboxProps {
    onCheckboxChange: (gender: "male" | "female") => void;
    selectedGender: string;
}

const GenderCheckbox = ({ onCheckboxChange, selectedGender }: GenderCheckboxProps) => {
    return (
        <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
            <div className='flex gap-4'>
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1 ${
                    selectedGender === "male" 
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                        : "border-gray-300 hover:border-indigo-300 text-gray-700"
                }`}>
                    <input
                        type='radio'
                        name='gender'
                        className='w-4 h-4 text-indigo-600 focus:ring-indigo-500'
                        checked={selectedGender === "male"}
                        onChange={() => onCheckboxChange("male")}
                    />
                    <span className='font-medium'>Male</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1 ${
                    selectedGender === "female" 
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                        : "border-gray-300 hover:border-indigo-300 text-gray-700"
                }`}>
                    <input
                        type='radio'
                        name='gender'
                        className='w-4 h-4 text-indigo-600 focus:ring-indigo-500'
                        checked={selectedGender === "female"}
                        onChange={() => onCheckboxChange("female")}
                    />
                    <span className='font-medium'>Female</span>
                </label>
            </div>
        </div>
    );
};

export default GenderCheckbox;


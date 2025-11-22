import React, { useState, useEffect } from 'react';
import { Minus, Plus, Type } from 'lucide-react';

const TextSizeControl = () => {
    const [currentSize, setCurrentSize] = useState(16); // Default base font size

    useEffect(() => {
        const root = document.documentElement;
        const baseSize = parseFloat(getComputedStyle(root).getPropertyValue('--base-font-size'));
        setCurrentSize(baseSize);
    }, []);

    const changeFontSize = (amount) => {
        const newSize = Math.max(12, Math.min(24, currentSize + amount));
        document.documentElement.style.setProperty('--base-font-size', `${newSize}px`);
        setCurrentSize(newSize);
    };

    return (
        <div className="flex items-center gap-2 bg-gray-100/80 rounded-full p-1">
            <button onClick={() => changeFontSize(-1)} className="p-1.5 rounded-full hover:bg-gray-200/80 transition-colors">
                <Minus size={16} className="text-gray-600" />
            </button>
            <Type size={16} className="text-gray-500" />
            <button onClick={() => changeFontSize(1)} className="p-1.5 rounded-full hover:bg-gray-200/80 transition-colors">
                <Plus size={16} className="text-gray-600" />
            </button>
        </div>
    );
};

export default TextSizeControl;

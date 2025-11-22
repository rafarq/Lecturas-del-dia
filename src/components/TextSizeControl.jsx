import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Type, Minus, Plus } from 'lucide-react';

const TextSizeControl = () => {
    const { increaseFontSize, decreaseFontSize } = useTheme();

    return (
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-gray-200">
            <button
                onClick={decreaseFontSize}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                aria-label="Disminuir tamaño de texto"
            >
                <Minus size={16} />
            </button>
            <Type size={16} className="text-gray-400" />
            <button
                onClick={increaseFontSize}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                aria-label="Aumentar tamaño de texto"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};

export default TextSizeControl;

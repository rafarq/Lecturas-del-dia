import React from 'react';
import TextSizeControl from './TextSizeControl';

const Header = ({ date }) => {
    return (
        <header className="sticky top-0 z-10 py-4 px-4 glass mb-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Lecturas de Hoy</h1>
                    <p className="text-xs text-gray-500 capitalize">{date || 'Cargando...'}</p>
                </div>
                <TextSizeControl />
            </div>
        </header>
    );
};

export default Header;

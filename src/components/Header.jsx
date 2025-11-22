import React from 'react';
import TextSizeControl from './TextSizeControl';

const Header = ({ date }) => {
    return (
        <header className="sticky top-0 z-10 py-4 glass rounded-b-2xl">
            <div className="flex justify-between items-center px-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Lecturas de Hoy</h1>
                    <p className="text-sm text-gray-500 capitalize">{date || 'Cargando...'}</p>
                </div>
                <TextSizeControl />
            </div>
        </header>
    );
};

export default Header;

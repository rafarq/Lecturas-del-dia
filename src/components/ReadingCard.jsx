import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ReadingCard = ({ reading }) => {
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        const checkScroll = () => {
            if (contentRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
                // Mostrar flecha si hay contenido para hacer scroll hacia abajo
                const hasMoreContent = scrollHeight > clientHeight;
                const isAtBottom = scrollHeight - scrollTop - clientHeight < 10; // 10px de margen
                setShowScrollIndicator(hasMoreContent && !isAtBottom);
            }
        };

        checkScroll();
        const contentElement = contentRef.current;
        if (contentElement) {
            contentElement.addEventListener('scroll', checkScroll);
            // También verificar cuando cambia el tamaño
            window.addEventListener('resize', checkScroll);
        }

        return () => {
            if (contentElement) {
                contentElement.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [reading]);

    if (!reading) return null;

    return (
        <div className="card h-full flex flex-col relative">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-sans text-accent mb-1" style={{ color: 'var(--color-accent)' }}>
                    {reading.type}
                </h2>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                    {reading.reference}
                </p>
            </div>

            <div ref={contentRef} className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {reading.text}
                </div>
            </div>

            {/* Indicador de scroll */}
            {showScrollIndicator && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-10"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-accent/90 text-white rounded-full p-2 shadow-lg"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                    >
                        <ChevronDown size={24} />
                    </motion.div>
                </motion.div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <span className="text-xs text-gray-400 italic">Palabra de Dios</span>
            </div>
        </div>
    );
};

export default ReadingCard;

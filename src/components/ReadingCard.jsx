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
                const hasMoreContent = scrollHeight > clientHeight;
                const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
                setShowScrollIndicator(hasMoreContent && !isAtBottom);
            }
        };

        const contentElement = contentRef.current;
        if (contentElement) {
            // Initial check
            const timer = setTimeout(checkScroll, 100); // Delay to allow rendering
            contentElement.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            
            return () => {
                clearTimeout(timer);
                contentElement.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [reading]);

    if (!reading) return null;

    return (
        <div className="card h-full flex flex-col">
            <div className="mb-6 border-b border-gray-900/10 pb-4">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
                    {reading.type}
                </h2>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                    {reading.reference}
                </p>
            </div>

            <div ref={contentRef} className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                <div className="prose max-w-none text-gray-800 leading-loose whitespace-pre-line">
                    {reading.text}
                </div>
            </div>

            {showScrollIndicator && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
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

            <div className="mt-6 pt-4 border-t border-gray-900/10 text-center">
                <span className="text-sm text-gray-500 italic">Palabra de Dios</span>
            </div>
        </div>
    );
};

export default ReadingCard;

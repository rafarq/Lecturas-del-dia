import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReadingCard from './ReadingCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 3,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95
    })
};

const SwipeContainer = ({ readings }) => {
    const [[page, direction], setPage] = useState([0, 0]);

    // Determine the reading to display
    const readingIndex = Math.abs(page % readings.length);
    const currentReading = readings[readingIndex];

    const paginate = (newDirection) => {
        if (readingIndex + newDirection < 0 || readingIndex + newDirection >= readings.length) return;
        setPage([page + newDirection, newDirection]);
    };

    // Swipe confidence threshold
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    // Calcular las tarjetas visibles (actual + 2 siguientes)
    const visibleCards = [];
    for (let i = 0; i < Math.min(3, readings.length); i++) {
        const index = readingIndex + i;
        if (index < readings.length) {
            visibleCards.push({
                reading: readings[index],
                index: index,
                offset: i
            });
        }
    }

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-visible">
            {/* Tarjetas apiladas de fondo */}
            {visibleCards.map((card, idx) => {
                if (idx === 0) return null; // La tarjeta actual se renderiza con AnimatePresence

                const offset = idx;
                const yOffset = offset * 50; // Desplazamiento vertical muy aumentado
                const scale = 1 - (offset * 0.04); // Escala ligeramente reducida
                const opacity = 0.7 - (offset * 0.2); // Opacidad reducida
                const zIndex = 3 - offset; // z-index decreciente

                return (
                    <motion.div
                        key={`stack-${card.index}`}
                        className="absolute w-full h-full max-w-6xl p-4"
                        style={{
                            zIndex: zIndex,
                            pointerEvents: 'none'
                        }}
                        initial={false}
                        animate={{
                            y: yOffset,
                            scale: scale,
                            opacity: opacity
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                    >
                        <ReadingCard reading={card.reading} />
                    </motion.div>
                );
            })}

            {/* Tarjeta actual (con animación de swipe) */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    dragDirectionLock
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute w-full h-full max-w-6xl p-4"
                    style={{ zIndex: 3 }}
                >
                    <ReadingCard reading={currentReading} />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls Overlay */}

            {/* Visual Swipe Indicators */}
            {readingIndex > 0 && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-accent/20 rounded-full z-[100]" />
            )}
            {readingIndex < readings.length - 1 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-accent/20 rounded-full z-[100]" />
            )}

            {/* Page Indicator - Absolute Bottom Center */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-[100]">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm pointer-events-auto">
                    {readings.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${idx === readingIndex ? 'bg-accent scale-125' : 'bg-gray-300'}`}
                            style={{ backgroundColor: idx === readingIndex ? 'var(--color-accent)' : undefined }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SwipeContainer;

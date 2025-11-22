import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReadingCard from './ReadingCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        };
    }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

const SwipeContainer = ({ readings }) => {
    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection) => {
        let newPage = page + newDirection;
        if (newPage < 0) {
            newPage = readings.length - 1;
        } else if (newPage >= readings.length) {
            newPage = 0;
        }
        setPage([newPage, newDirection]);
    };

    const readingIndex = page;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <AnimatePresence initial={false} custom={direction}>
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
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="w-full h-full absolute"
                >
                    <ReadingCard reading={readings[readingIndex]} />
                </motion.div>
            </AnimatePresence>

            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0 z-10 pointer-events-none">
                 <button onClick={() => paginate(-1)} className="pointer-events-auto bg-white/50 hover:bg-white/80 transition-colors rounded-full p-2 ml-[-1.5rem]">
                    <ChevronLeft className="text-gray-700" />
                </button>
                <button onClick={() => paginate(1)} className="pointer-events-auto bg-white/50 hover:bg-white/80 transition-colors rounded-full p-2 mr-[-1.5rem]">
                    <ChevronRight className="text-gray-700" />
                </button>
            </div>

            <div className="absolute bottom-[-0.5rem] flex justify-center gap-2 z-10">
                {readings.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setPage([i, i > page ? 1 : -1])}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${i === readingIndex ? 'w-4 bg-accent' : 'bg-gray-300'}`}
                        style={{ backgroundColor: i === readingIndex ? 'var(--color-accent)' : '#d1d5db' }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SwipeContainer;

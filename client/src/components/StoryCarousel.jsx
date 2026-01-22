import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stories = [
    {
        image: '/assets/cyclone_rescue_india_1769011536239.png',
        text: "WHEN NATURE STRIKES WITH FURY..."
    },
    {
        image: '/assets/night_rescue_india_1769011807312.png',
        text: "...AND DARKNESS FALLS UPON HOPE..."
    },
    {
        image: '/assets/helicopter_rescue_india_1769012009112.png',
        text: "...WE RISE FROM THE SKIES..."
    },
    {
        image: '/assets/medical_relief_india_1769011964213.png',
        text: "...TO HEAL, PROTECT, AND SERVE."
    },
    {
        image: '/assets/flood_rescue_india_1769011472727.png',
        text: "DISASTERSYNC: UNITED FOR HUMANITY."
    }
];

const StoryCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section style={{
            position: 'relative',
            width: '100%',
            height: '80vh',
            overflow: 'hidden',
            backgroundColor: '#000',
            fontFamily: 'var(--font-heading)'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${stories[currentIndex].image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)',
                        opacity: 0.9
                    }} />
                </motion.div>
            </AnimatePresence>

            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 1rem',
                zIndex: 10
            }}>
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 4rem)',
                            fontWeight: 'bold',
                            letterSpacing: '0.1em',
                            color: 'white',
                            textTransform: 'uppercase',
                            textShadow: '0 4px 10px rgba(0,0,0,0.8)',
                            margin: 0
                        }}
                    >
                        {stories[currentIndex].text}
                    </motion.h2>
                </AnimatePresence>
            </div>

            {/* Progress Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                zIndex: 20
            }}>
                {stories.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            height: '4px',
                            width: index === currentIndex ? '3rem' : '1rem',
                            backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                            borderRadius: '9999px',
                            transition: 'all 0.5s'
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default StoryCarousel;

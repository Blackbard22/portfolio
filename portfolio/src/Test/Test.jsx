import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './test.module.css';
import { gsap } from 'gsap';
import SplitText from "gsap-trial/SplitText"
gsap.registerPlugin(SplitText)


const Stagger = ({ text }) => {

    const handleMouseEnter = () => {
        gsap.killTweensOf(`.${styles.stagger}`);

        let splitText = new SplitText(`.${styles.stagger}`, { type: 'chars' });
        let chars = splitText.chars;


        const tl = gsap.timeline();

        // First, shoot the characters up out of view
        tl.fromTo(chars, {
            yPercent: 0,
            opacity: 1,
            stagger: 0.02,
            ease: "back.in",
            duration: 0.4,
        }, {
            yPercent: -100,
            opacity: 0,
            stagger: 0.02,
            ease: "back.in",
            duration: 0.4,
        })
            // Then, make them appear from below
            .from(chars, {
                yPercent: 100,
                opacity: 0,
                stagger: 0.02,
                ease: "back.out",
                duration: 0.8,
            });

    };

    const cursorRef = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            mousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const onClick = () => {
            if (!isAnimating) {
                setIsAnimating(true);

                if (cursorRef.current) {
                    cursorRef.current.classList.remove(styles.cursor_animate_reset);
                    cursorRef.current.classList.add(styles.cursor_animate);

                    // Reset animation after it completes
                    setTimeout(() => {
                        if (cursorRef.current) {
                            cursorRef.current.classList.remove(styles.cursor_animate);
                            cursorRef.current.classList.add(styles.cursor_animate_reset);
                            setIsAnimating(false);
                        }
                    }, 150);
                }
            }
        };



        const animateCursor = () => {
            const dx = mousePosition.current.x - currentPosition.current.x;
            const dy = mousePosition.current.y - currentPosition.current.y;

            currentPosition.current.x += dx * 0.15;
            currentPosition.current.y += dy * 0.15;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${currentPosition.current.x}px, ${currentPosition.current.y}px)`;
            }

            rafId.current = requestAnimationFrame(animateCursor);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);
        rafId.current = requestAnimationFrame(animateCursor);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [isAnimating]);

    return (
        <div className={styles.contianer}>


            <div className={styles.stagger_container}>
                <h1 className={styles.stagger}
                    onMouseEnter={handleMouseEnter}
                > {text}</h1>
            </div>

            <div
                ref={cursorRef}
                className={styles.cursor_square}
                style={{
                    position: 'fixed',
                    pointerEvents: 'none',
                    transform: 'translate(0px, 0px)',
                    left: 0,
                    top: 0
                }}
            >
                <div className={styles.cursor_inner} />
            </div>
        </div>
    );
}

export default Stagger;
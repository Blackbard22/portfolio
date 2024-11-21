import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './projects.module.css';
import { baseFragmentShader, baseVertexShader } from '../Shaders/baseSahder';
import { abstractFragmentShader, abstractVertexShader } from '../Shaders/abstractShader';
import ShaderMaterial from '../BaseShader/BaseShader';
import AbstractShaderMaterial from '../AbstractShade/AbstractShade';
import SlideReel from '../SlideReel/SlideReel';
import Transition from '../Transition/Transition';
import { Link } from 'react-router-dom';



const Projects = () => {
    const cursorRef = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });
    const [cursorHeight, setCursorHeight] = useState(0);
    const [cursorSquare, setCursorSquare] = useState({ height: 0, width: 0, left: 0, top: 0, right: 0, bottom: 0 });
    const rafId = useRef(null);
    const hover_id = useRef(null);
    const [hoverId, setHoverId] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [measurements, setMeasurements] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading time of 3 seconds, adjust as needed
        const loadingTimer = setTimeout(() => {
            setIsLoading(false); // Hide loader and show main content
        }, 1400);

        return () => clearTimeout(loadingTimer);
    }, []);


    const loadTitle = () => {
        const title = document.querySelector(`.${styles.title}`);
        console.log('Title element found:', title);
        console.log('Available styles:', styles);

        if (title) {
            title.className = `${styles.title} ${styles.slide}`;
        }

    }
    useEffect(() => {
        loadTitle();
    }, []);


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

            setCursorHeight(currentPosition.current.y - 100);


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

    const set_hover = (e) => {
        const hover = e.currentTarget.dataset.hoverId;
        const hover_state = Number(hover)
        hover_id.current = hover;
        hover_id.current = Number(hover);
        console.log('Hover:', hover_id.current);
        setHoverId(hover_state);

    }

    const get_demensions = (e) => {
        const rect = e.target.getBoundingClientRect();
        setMeasurements({
            height: rect.height,
            width: rect.width,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom
        });
        console.log('Measurements:', measurements);

    }

    useEffect(() => {
        const checkMobileDevice = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;


            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

            const mobile = mobileRegex.test(userAgent);
            setIsMobile(mobile);

            const screenMobile = window.innerWidth <= 768;

            return mobile || screenMobile;
        };

        const result = checkMobileDevice();


        window.addEventListener('resize', checkMobileDevice);

        return () => {
            window.removeEventListener('resize', checkMobileDevice);
        };
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.canvasContainer}>
                <Canvas
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                    }}
                    camera={{ position: [0, 0, 1] }}
                    gl={{
                        antialias: true,
                        alpha: false,
                        preserveDrawingBuffer: false
                    }}>
                    <ShaderMaterial />
                </Canvas>
            </div>
            <div className={styles.midCanvas}>
                <div className={styles.footer}>
                    <div className={styles.title}>Projects</div>
                    <div className={styles.subTitle}>A sandbox of ideas</div>
                </div>
                <div className={styles.project_list}>
                    <div className={styles.project} data-hover-id={0} onMouseEnter={(e) => { set_hover(e); get_demensions(e); }} onMouseLeave={() => { setHoverId(null); setMeasurements(null) }}>

                        <Link to="/mlmaze">
                            <p>  MLMAZE</p>
                        </Link>
                    </div>
                    <div className={styles.project} data-hover-id={1} onMouseEnter={(e) => { set_hover(e); get_demensions(e); }} onMouseLeave={() => { setHoverId(null); setMeasurements(null) }}>
                        <Link to="/web_dash">
                            <p>Web Dash</p>
                        </Link>
                    </div>
                </div>

            </div>


            {(hoverId != null && !isMobile) && (
                <div
                    className={styles.reel}
                    style={{
                        position: 'absolute',
                        top: `${cursorHeight}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <SlideReel picIndex={hoverId} />
                </div>
            )}

            {isLoading && <Transition />}
            <div className={styles.overlay} />

            <div className={styles.border}

                style={{
                    position: 'fixed',
                    display: 'none',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    transform: measurements
                        ? 'translate(0, 0)'
                        : `translate(${currentPosition.current.x}px, ${currentPosition.current.y}px)`,
                    ...(measurements && {
                        display: 'block',
                        height: `${measurements.height}px`,
                        width: `${measurements.width}px`,
                        left: `${measurements.left}px`,
                        top: `${measurements.top}px`,
                    })
                }}


            />

            <div
                ref={cursorRef}
                className={styles.cursor_square}
                style={{
                    position: 'fixed',
                    pointerEvents: 'none',
                    transform: 'translate(0px, 0px)',

                    ...(measurements && {
                        display: 'none',
                    })
                }}
            >
                <div className={styles.cursor_inner} />

            </div>

        </div>


    );
};

export default Projects;

import React, { useMemo, useState, useEffect, useRef } from 'react';
import styles from './projectView2.module.css';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import AbstractShade from '../AbstractShade/AbstractShade';
import dash from '../../public/dashboard.png';
import dash2 from '../../public/dashboard2.png';
import { baseFragmentShader, baseVertexShader } from '../Shaders/baseSahder';
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CSSRulePlugin } from "gsap/CSSRulePlugin";



import image2 from '../../public/exec-dash.png'
import image1 from '../../public/exec-dash2.png'
import image3 from '../../public/exec-dash3.png'


import github from '../../public/github.svg';
import external from '../../public/external.png';
import Transition from '../Transition/Transition';





gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);



const ShaderMaterial = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);


    useEffect(() => {
        const handleResize = () => setAspect(window.innerWidth / window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector3() },
                speedFactor: { value: 1.0 }
            },
            vertexShader: baseVertexShader,
            fragmentShader: baseFragmentShader
        });
    }, []);





    useFrame((state) => {
        shaderMaterial.uniforms.iTime.value = state.clock.elapsedTime;
        shaderMaterial.uniforms.iResolution.value.set(
            window.innerWidth,
            window.innerHeight,
            1
        );
        const targetSpeed = isHovered ? 0.2 : 1.0;
        shaderMaterial.uniforms.speedFactor.value +=
            (targetSpeed - shaderMaterial.uniforms.speedFactor.value) * 0.1;
    });

    return (
        <mesh
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <planeGeometry args={[2 * aspect, 2]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};





const ProjectView = () => {
    const cursorRef = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const wrapper = useRef(null);
    const [isGrid, setIsGrid] = useState(true);
    const layoutRef = useRef(null);
    const itemRefs = useRef(["React", "nodejs", "lighthouse_api"]);
    const images = [dash, dash2, dash];
    const imageRefs = useRef([]);
    const contentWrapperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1400);

        return () => clearTimeout(loadingTimer);
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


    if (window.innerWidth < 800) {
        useGSAP(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: `.${styles.image_grid}`,
                    start: "top+=350 bottom",
                    end: "bottom top",
                    scrub: true,
                    scroller: `.${styles.contentWrapper}`,
                },
            });
            tl.fromTo(
                `.${styles.grid_image_1}`,
                { opacity: 1, y: 0 },
                { opacity: 0, y: -50, duration: 0.5 }
            ).fromTo(
                `.${styles.grid_image_2}`,
                { opacity: 1, y: 0 },
                { opacity: 0, y: 50, duration: 0.5 }
            ).fromTo(
                `.${styles.grid_image_3}`,
                { opacity: 1, y: 0 },
                { opacity: 0, y: 50, duration: 0.5 }
            );
        });
    }





    useGSAP(() => {
        const layout = document.querySelector(`.${styles.proj_info}`);
        layout.classList.toggle(styles.row);



        const afterRule = CSSRulePlugin.getRule(`.${styles.proj_info}::after`);
        const beforeRule = CSSRulePlugin.getRule(`.${styles.proj_info}::before`);

        const topBeforeRule = CSSRulePlugin.getRule(`.${styles.proj_info_top}::before`);
        const topAfterRule = CSSRulePlugin.getRule(`.${styles.proj_info_top}::after`);

        const tl = gsap.timeline({
            defaults: { duration: 1, ease: "power2.inOut" },
            scrollTrigger: {
                trigger: `.${styles.contentWrapper}`,
                scroller: `.${styles.contentWrapper}`,
                start: "top top",
                end: "top+=30 top",
                scrub: 2,
                pin: `.${styles.proj_info}`,
                smoothChildTiming: true,
            },
        });

        tl.to(afterRule, {
            width: '50%',
        })
            .to(beforeRule, {
                width: '50%',
            }, '<')
            .fromTo(
                `.${styles.proj_info}`,
                { opacity: 1 },
                {
                    opacity: 0,
                }
            ).fromTo(
                `.${styles.proj_info_wrapper}`,
                {
                    position: "sticky",
                    top: '50%',

                },
                {
                    position: "sticky",
                    top: 0,
                    transform: 'translateY(0%)',
                    justifyContent: "start",
                }
            )
            .fromTo(
                `.${styles.proj_info_top}`,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 1,
                }
            ).fromTo(
                `.${styles.proj_stack_top}`,
                {
                    y: -200,
                    x: 20
                },
                {
                    y: 0,
                    x: 0

                },
                '<'
            ).fromTo(
                `.${styles.proj_title_top}`,
                {
                    y: -100,
                    x: -20
                },
                {
                    y: 0,
                    x: 0

                },
                '<'
            )
            .fromTo(
                `.${styles.title_top}`,
                {
                    x: -100,
                    marginRight: 0
                },
                {
                    x: 0,
                    marginRight: '1em'

                },
                '<'
            ).to(
                topAfterRule,
                {
                    width: '50%'
                },
                '<'
            ).to(
                topBeforeRule,
                {
                    width: '50%'
                },
                '<'
            ).to(
                `.${styles.proj_info_top}`,
                {
                    scale: 0.9,
                    delay: 0.5,
                    borderRight: 0,
                    borderLeft: 0,
                }
            ).fromTo(
                `.${styles.image_grid}`,
                {
                    opacity: 0,
                    y: 100
                },
                {
                    opacity: 1,
                    y: 0
                }
            )


    });




    return (
        <div className={styles.rootContainer}>
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
                        preserveDrawingBuffer: false,
                    }}>
                    <AbstractShade />
                </Canvas>
            </div>

            <div className={styles.contentWrapper} ref={contentWrapperRef}>
                <div className={styles.proj_info_wrapper}>
                    <div className={styles.proj_info} ref={layoutRef}>
                        <div className={styles.title} ref={wrapper}>
                            <h1>Web Dash</h1>
                        </div>
                        <div className={styles.grid_text}>
                            <div className={styles.proj_grid}>
                                <div className={styles.proj_title}>
                                    <h3>Project Overview </h3>
                                    <div className={styles.proj_summary}>
                                        Get all the major website metrics given a domain
                                    </div>
                                </div>
                                <div className={styles.proj_stack}>
                                    {itemRefs.current.map((item, index) => (
                                        <div
                                            key={item}
                                            className={styles.proj_container}
                                        >
                                            <p>
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.proj_info_top} ref={layoutRef}>
                        <div className={styles.title_top} ref={wrapper}>
                            <h1>Web Dash</h1>

                        </div>
                        <div className={styles.grid_text}>
                            <div className={styles.proj_grid_top}>
                                <div className={styles.proj_title_top}>
                                    <h3>Project Overview </h3>
                                    <div className={styles.proj_summary}>
                                        Get all the major website metrics given a domain
                                    </div>
                                </div>
                                <div className={styles.proj_stack_top}>
                                    {itemRefs.current.map((item, index) => (
                                        <div
                                            key={item}
                                            className={styles.proj_container}
                                        >
                                            <p>
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {isLoading && <Transition />}


                <div className={styles.image_grid} >
                    <div className={styles.grid_image_1}>
                        <img src={image1} alt="" />
                        <div className={styles.grid_image_text}>
                            <p>
                                Main web metrics
                            </p>
                        </div>
                    </div>
                    <div className={styles.grid_image_2}>
                        <img src={image2} alt="" />
                        <div className={styles.grid_image_text}>
                            <p>
                                Query any domain
                            </p>
                        </div>
                    </div>
                    <div className={styles.grid_image_3}>
                        <img src={image3} alt="" />
                        <div className={styles.grid_image_text}>
                            <p>
                                Memory usage through load
                            </p>
                        </div>
                    </div>

                </div>

                <div className={styles.footer}>
                    <div className={styles.hub_icon}>
                        <img src={github} alt="" />
                    </div>
                    <div className={styles.site_link}>

                        <img src={external} alt="" />
                    </div>



                </div>


            </div>

            <div className={styles.overlay} />


            <section class={styles.scroll}>
                <a><span></span></a>
            </section>



            <div
                ref={cursorRef}
                className={styles.cursor_square}
                style={{
                    position: 'fixed',
                    pointerEvents: 'none',
                    transform: 'translate(0px, 0px)',
                    left: 0,
                    top: 0,
                    zIndex: 9999
                }}
            >
                <div className={styles.cursor_inner} />
            </div>
        </div>
    );
};

export default ProjectView;
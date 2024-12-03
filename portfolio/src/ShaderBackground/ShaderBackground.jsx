import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import styles from './shaderBackground.module.css';
import Transition from '../Transition/Transition';
import close from '../../public/close_white.svg';



const ResizeHandler = () => {
    const { camera, gl } = useThree();
    const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            const newAspect = window.innerWidth / window.innerHeight;
            setAspect(newAspect);


            camera.aspect = newAspect;
            camera.updateProjectionMatrix();


            gl.setSize(window.innerWidth, window.innerHeight);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [camera, gl]);

    return null;
};








const ShaderMaterial = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);


    const { size } = useThree();


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
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float iTime;
uniform vec3 iResolution;
varying vec2 vUv;

const float size = 100.0;

vec2 rotateVec(vec2 v, float a) {
    float b = -a / 180.0 * 3.1415926;
    return vec2(cos(b) * v.x + sin(b) * v.y, cos(b) * v.y - sin(b) * v.x);
}

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 hexHeight(vec2 coord) {
    coord.y /= 0.8660254;
    coord.x = coord.x - 0.5 * coord.y;
    vec2 cellCoord = floor(coord);
    int cellType = int(mod(cellCoord.x - cellCoord.y, 3.0));
    vec2 iCC = mod(coord, 1.0);
    int halfIndex = int(step(1.0, iCC.x + iCC.y));
    float height;
    vec2 center;
    
    if(cellType == 0) {
        center = cellCoord + vec2(1.0, 0.0);
        if(halfIndex == 0) {
            height = iCC.x;
        } else {
            height = 1.0 - iCC.y;
        }
    } else if(cellType == 1) {
        if(halfIndex == 0) {
            center = cellCoord;
            height = 1.0 - iCC.x - iCC.y;
        } else {
            center = cellCoord + vec2(1.0, 1.0);
            height = iCC.x + iCC.y - 1.0;
        }
    } else {
        center = cellCoord + vec2(0.0, 1.0);
        if(halfIndex == 0) {
            height = iCC.y;
        } else {
            height = 1.0 - iCC.x;
        }
    }
    return vec3(height, center);
}

float getBrightness(vec2 pos, vec2 offset) {
    vec3 h = hexHeight(rotateVec((pos + iTime) / size, iTime) + offset);
    float b = rand(h.yz) * 0.5 + 0.7;
    float a = step(3.0 * sin(iTime/8.0 + b * 1000.0) - 2.0, h.x);
    return 1.0 - a*b;
}

float getLayeredBrightness(vec2 pos) {
    float brightness = getBrightness(pos, vec2(0.0));
    for(int i = 1; i <= 12; i ++) {
        float factor = 0.4/float(i);
        vec2 dir = vec2(mod(float(i), 2.0), mod(float(i+1), 2.0)) * (mod(floor(float(i)/2.0), 2.0) * 2.0 - 1.0);
        vec2 offset = vec2(floor(float(i+3)/4.0) * size + 1.0) * dir;
        brightness += factor * clamp(getBrightness(pos, offset) - 0.2, 0.0, 1.0);
    }
    return brightness;
}

vec2 glitchFilter(vec2 pos, float seed) {
    float r = rand(vec2(floor(iTime*10.0), floor(pos.y/ 60.0)));
    if(r <= 0.1) pos.x += 300.0 * r * seed;
    return pos;
}

vec4 getColor(vec2 pos) {
    float red = getLayeredBrightness(glitchFilter(pos, 1.0));
    float cyan = getLayeredBrightness(glitchFilter(pos, 1.4));
    return vec4(red, cyan, cyan, 1.0);
}

void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    gl_FragColor = getColor(fragCoord.xy);
}
      `
        });
    }, [size]);

    useFrame((state) => {
        shaderMaterial.uniforms.iTime.value = state.clock.elapsedTime;
        shaderMaterial.uniforms.iResolution.value.set(
            size.width,
            size.height,
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
            <planeGeometry args={[2 * (size.width / size.height), 2]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};





const ShaderBackground = () => {
    const cursorRef = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
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







    useEffect(() => {
        const leftlink = document.querySelector(`.${styles.projects_link}`);
        const rightLink = document.querySelector(`.${styles.about_link}`);

        const handleMouseMove = (e) => {
            const height = window.innerHeight;
            const width = window.innerWidth;


            const verticalIntensity = Math.min(e.clientY / height, 1);


            const leftLinkHorizontalIntensity = Math.max(0, 1 - (e.clientX / (width / 2)));
            const rightLinkHorizontalIntensity = Math.max(0, (e.clientX - width / 2) / (width / 2));

            // Combine vertical and horizontal intensities
            if (leftlink) {
                const leftCombinedIntensity = (verticalIntensity + leftLinkHorizontalIntensity) / 2;
                leftlink.style.setProperty('--gradient-opacity', Math.min(leftCombinedIntensity.toFixed(2), 0.6));
                leftlink.style.setProperty('--blur', `${(leftCombinedIntensity * 6).toFixed(2)}px`);
            }

            if (rightLink) {
                const rightCombinedIntensity = (verticalIntensity + rightLinkHorizontalIntensity) / 2;
                rightLink.style.setProperty('--gradient-opacity', Math.min(rightCombinedIntensity.toFixed(2), 0.6));
                rightLink.style.setProperty('--blur', `${(rightCombinedIntensity * 6).toFixed(2)}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);







    const handleMobileMenu = () => {
        const mobileMenu = document.querySelector(`.${styles.mobile_menu}`);
        const close_icon = document.querySelector(`.${styles.close_icon}`)
        if (close_icon) {
            if (close_icon.classList.contains(styles.close)) {
                close_icon.classList.remove(styles.close)
            }
        }

        if (mobileMenu) {
            if (mobileMenu.classList.contains(styles.active)) {
                mobileMenu.classList.remove(styles.active);
                mobileMenu.classList.add(styles.collapsed);
                close_icon.classList.toggle(styles.close)
                console.log(mobileMenu);
            } else {
                mobileMenu.classList.remove(styles.collapsed);
                mobileMenu.classList.add(styles.active);


                console.log(mobileMenu);

            }
        }
    };


    useEffect(() => {
        
        const isMobile = window.innerWidth <= 800;
        
        if (isMobile) {
            const project = document.querySelector(`.${styles.projects_link}`);
            const about = document.querySelector(`.${styles.about_link}`);
            
            if (project) {
                project.classList.add(styles.animate);
            }
            if (about) {
                about.classList.add(styles.animate);
            }
        }
    }, []);
    


    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            zIndex: 1
        }}>
            <Canvas
                style={{
                    display: 'block',
                    minWidth: '100%',
                    zIndex: -2
                }}
                camera={{ position: [0, 0, 1] }}
                gl={{
                    antialias: true,
                    alpha: false,
                    preserveDrawingBuffer: false
                }}
            >
                <ResizeHandler />
                <ShaderMaterial />
            </Canvas>

            <div className={styles.initial_info}>
                <div className={styles.top_banner}>
                    <div className={styles.country}>
                        <p>Muscat</p>
                        <p>OM</p>
                    </div>
                    <div>
                        <svg
                            className={styles.options_button}
                            width="50"
                            height="50"
                            viewBox="0 0 100 100"
                            onClick={handleMobileMenu}
                        >

                            <rect className={styles.square} x="10" y="10" width="20" height="20" />

                            <rect className={styles.square} x="60" y="10" width="20" height="20" />

                            <rect className={styles.square} x="10" y="60" width="20" height="20" />

                            <rect className={styles.square} x="60" y="60" width="20" height="20" />
                            

                        </svg>
                    </div>
                </div>

                <div className={styles.title}>
                    <h1>Mo Hosni</h1>
                    <p>Full-stack engineer</p>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.projects_link}>

                    <Link to="/projects">
                        <p>Projects</p>
                    </Link>
                </div>
                <div className={styles.about_link}>

                    <Link to="/about">
                        <p>About</p>
                    </Link>

                </div>
            </div>

            {isLoading &&
                <Transition />

            }

            <div className={styles.mobile_menu} >
                <div className={styles.mobile_navbar_close} onClick={handleMobileMenu}>
                    <img src={close} alt="" className={styles.close_icon} />
                </div>
                <div className={styles.mobile_navbar_links}>
                    <div>
                        <Link to="/projects">
                            <p>Projects</p>
                        </Link>
                    </div>
                    <div>
                        <Link to="/about">
                            <p>About</p>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.overlay}>

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
};

export default ShaderBackground;



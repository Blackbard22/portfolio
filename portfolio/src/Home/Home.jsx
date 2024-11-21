import React, {useEffect, useState} from 'react';
import styles from './Home.module.css'; 




const Home = () => {

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 });
  
    useEffect(() => {
      const cursor = document.querySelector('.cursor_dot');
      const cursorBorder = document.querySelector('.cursor_border');
  
      const onMouseMove = (e) => {
        // Update dot position immediately
        setPosition({ x: e.clientX, y: e.clientY });
        
        // Update border position with a slight delay
        setTimeout(() => {
          setTrailingPosition({ x: e.clientX, y: e.clientY });
        }, 0);
      };
  
      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);



    return (
        <div >
            <h1>Welcome to the Home Page</h1>
            <p>This is a template for a React functional component.</p>

            <div
        className={styles.cursor_dot}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />
      
      <div
        className={styles.cursor_border}
        style={{
          left: `${trailingPosition.x}px`,
          top: `${trailingPosition.y}px`
        }}
      />
        </div>
    );
};

export default Home;
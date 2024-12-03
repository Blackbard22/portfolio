import React, { useState, useEffect } from 'react';
import styles from './slideReel.module.css';
// import pic1 from '../../public/architecture.jpg';
// import pic2 from '../../public/obscure.jpg'
import pic1 from '../../public/maze1.png'
import pic2 from '../../public/exec-dash2.png'


const SlideReel = ({ picIndex }) => {
    const pictures = [pic1, pic2];
    const [currentPicIndex, setCurrentPicIndex] = useState(picIndex);

    // useEffect(() => {
    //     setCurrentPicIndex(picIndex);
    // }, [picIndex]);

    // const animateNumbers = (index) => {
    //     const numberItems = document.querySelectorAll(`.${styles.counter} p`);

    //     numberItems.forEach((item, i) => {
    //       if (i === index) {
    //         item.style.transition = 'transform 0.7s ease-in-out';
    //         item.style.transform = 'translateY(0%)';
    //       } else {
    //         item.style.transition = 'transform 0.7s ease-in-out';
    //         item.style.transform = 'translateY(200%)';
    //       }
    //     });
    // };

    // useEffect(() => {
    //     animateNumbers(currentPicIndex);
    // }, [currentPicIndex]);
    return (
        <div className={styles.container}>
            <div className={styles.image_container}>
                <img
                    key={currentPicIndex}
                    src={pictures[currentPicIndex]} alt="Slide"

                />
            </div>
            <div className={styles.counter}
                key={currentPicIndex}

            >
                <p>{currentPicIndex + 1}</p>
            </div>
        </div>
    );
};

export default SlideReel;
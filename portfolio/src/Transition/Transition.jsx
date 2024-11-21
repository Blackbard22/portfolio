import React, { Component, useState } from 'react';
import anime from 'animejs';
import styles from './transition.module.css';

// class Transition extends Component {
//     state = {
//         columns: 0,
//         rows: 0,
//         total: 1
//     };

//     handleStagger = () => {
//         const { columns, rows } = this.state;
//         anime({
//             targets: `.${styles.grid_item}`,
//             scale: [
//                 { value: 0.8, duration: 200 },
//                 { value: 1, duration: 100 }
//             ],
//             backgroundColor: (el, i) => {
//                 const shadeValue = anime.random(100, 255);
//                 return `rgb(${shadeValue}, ${shadeValue}, ${shadeValue})`;
//             },
//             delay: anime.stagger(3, {
//                 grid: [columns, rows],
//                 from: 'center'
//             }),
//             direction: 'alternate',
//             easing: 'easeInOutQuad',
//             duration: 5
//         });
//     };

//     getGridSize = () => {
//         const columns = Math.floor(document.body.clientWidth / 50);
//         const rows = Math.floor(document.body.clientHeight / 50);
//         this.setState({ columns, rows, total: rows * columns }, () => {
//             anime({
//                 targets: `.grid_item`,
//                 backgroundColor: "#fff",
//                 duration: 1,
//                 easing: "linear"
//             });
//         });
//     };

//     componentDidMount() {
//         this.getGridSize();
//         window.addEventListener("resize", this.getGridSize);
//         this.handleStagger();
//     }

//     componentWillUnmount() {
//         window.removeEventListener("resize", this.getGridSize);
//     }

//     render() {
//         const { total } = this.state;
//         return (
//             <div className={styles.grid}>
//                 {[...Array(total)].map((_, i) => (
//                     <div key={i} className={styles.grid_item} />
//                 ))}
//             </div>
//         );
//     }
// }

// export default Transition;








// class Transition extends Component {
//     state = {
//         columns: 0,
//         rows: 0,
//         total: 1
//     };



//     handleStagger = () => {
//         const { columns, rows } = this.state;
//         console.log("Running stagger animation");


//         anime({
//             targets: `.${styles.grid_item}`, // Ensure this is correct
//             scale: [
//                 { value: 0.8, duration: 200 },
//                 { value: 1, duration: 100 }
//             ],
//             backgroundColor: (el, i) => {
//                 const shadeValue = anime.random(100, 255);
//                 return `rgb(${shadeValue}, ${shadeValue}, ${shadeValue})`;
//             },
//             delay: anime.stagger(1, {
//                 axis: [columns, rows],
//                 from: 'center'
//             }),
//             direction: 'alternate',
//             easing: 'easeInOutQuad',
//             duration: 1
//         });
//     };

//     getGridSize = () => {
//         const columns = Math.floor(document.body.clientWidth / 50);
//         const rows = Math.floor(document.body.clientHeight / 50);
//         this.setState({ columns, rows, total: rows * columns }, () => {
//             anime({
//                 targets: `.${styles.grid_item}`,
//                 backgroundColor: "#fff",
//                 duration: 1,
//                 easing: "linear"
//             });
//             this.handleStagger(); // Call stagger after grid setup
//         });
//     };

//     componentDidMount() {
//         this.getGridSize();
//         window.addEventListener("resize", this.getGridSize);
//     }

//     componentWillUnmount() {
//         window.removeEventListener("resize", this.getGridSize);
//     }





//     render() {
//         const { total } = this.state;
//         const [background, setBackground] = useState(true);

//         useEffect(() => {
//             // Simulate a loading time of 3 seconds, adjust as needed
//             const loadingTimer = setTimeout(() => {
//                 setBackground(false); // Hide loader and show main content
//             }, 600);

//             return () => clearTimeout(loadingTimer);
//         }, []);

//         return (
//             <div className={styles.grid} style={{ backgroundColor: background ? 'lightgrey' : 'transparent' }}>
//                 {[...Array(total)].map((_, i) => (
//                     <div key={i} className={styles.grid_item} />
//                 ))}
//             </div>
//         );
//     }
// }

// export default Transition;








class Transition extends Component {
    state = {
        columns: 0,
        rows: 0,
        total: 1,
        background: true
    };

    handleStagger = () => {
        const { columns, rows } = this.state;

        anime({
            targets: `.${styles.grid_item}`, // Ensure this is correct
            scale: [
                { value: 0.8, duration: 200 },
                { value: 1, duration: 100 }
            ],
            backgroundColor: (el, i) => {
                const shadeValue = anime.random(20, 255);
                return `rgb(${shadeValue}, ${shadeValue}, ${shadeValue})`;
            },
            delay: anime.stagger(1, {
                axis: [columns, rows],
                from: 'center'
            }),
            direction: 'alternate',
            easing: 'easeInOutQuad',
            duration: 1
        });

    };

    getGridSize = () => {
        const columns = Math.floor(document.body.clientWidth / 50);
        const rows = Math.floor(document.body.clientHeight / 50);
        this.setState({ columns, rows, total: rows * columns }, () => {
            anime({
                targets: `.${styles.grid_item}`,
                backgroundColor: "#fff",
                duration: 1,
                easing: "linear"
            });
            this.handleStagger();
        });
    };

    componentDidMount() {
        this.getGridSize();
        window.addEventListener("resize", this.getGridSize);

        // Set a timeout to hide the background after 600ms
        this.loadingTimer = setTimeout(() => {
            this.setState({ background: false });
        }, 600);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.getGridSize);
        clearTimeout(this.loadingTimer);
    }

    render() {
        const { total, background } = this.state;
        return (
            <div className={styles.grid} style={{ backgroundColor: background ? 'grey' : 'transparent' }}>
                {[...Array(total)].map((_, i) => (
                    <div key={i} className={styles.grid_item} />
                ))}
            </div>
        );
    }
}

export default Transition;



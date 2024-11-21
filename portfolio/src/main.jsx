import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import App from './App.jsx'
import './index.css'
import Scene from './Scene'
import Loading from './Loading'
import FBXViewer from './FBXViewer'
import ShaderBackground from './ShaderBackground/ShaderBackground.jsx'
import Home from './Home/Home.jsx'
import About from './About/About.jsx'
import Projects from './Projects/Projects.jsx'
import SlideReel from './SlideReel/SlideReel.jsx'
import ProjectView from './ProjectView/ProjectView.jsx'
import ProjectView2 from './ProjectView2/ProjectView2.jsx'
import { Path } from 'three';
import Transition from './Transition/Transition';
import Test from './Test/Test.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <ShaderBackground />
    },
    {
        path: '/projects',
        element: <Projects />
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/mlmaze',
        element: <ProjectView />
    },
    {
        path: '/web_dash',
        element: <ProjectView2 />
    }

])

createRoot(document.getElementById('root')).render(


    <RouterProvider router={router} />
)

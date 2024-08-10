import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

function App() {
    const mountRef = useRef(null)

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 15
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        mountRef.current.appendChild(renderer.domElement)

        // Custom shader material
        let material = new THREE.PointsMaterial({
            color: '#ffffff',
            size: 0.005
        })

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.addEventListener('change', () => renderer.render(scene, camera)) // Render only when controls change

        let downsampledPoints, fullResPoints

        const loader = new PLYLoader()
        loader.load(
            process.env.PUBLIC_URL + '/K24AC201_ds.ply',
            (bufferGeometry) => {
                downsampledPoints = new THREE.Points(bufferGeometry, material)
                scene.add(downsampledPoints)
                renderer.render(scene, camera)
                console.log("Downsampled point cloud loaded")
            }
        )

        // Load full-resolution point cloud
        loader.load(
            process.env.PUBLIC_URL + '/K24AC201_4M.ply',
            (bufferGeometry) => {
                fullResPoints = new THREE.Points(bufferGeometry, material)
                downsampledPoints.visible = false // Initially hide ds-res point cloud
                scene.add(fullResPoints)
                renderer.render(scene, camera)
                console.log("Full-resolution point cloud loaded")

                // Function to show downsampled points
                const showDownsampled = () => {
                    if (fullResPoints) fullResPoints.visible = false
                    if (downsampledPoints) downsampledPoints.visible = true
                    renderer.render(scene, camera)
                }

                // Function to show full-resolution points
                const showFullRes = () => {
                    if (fullResPoints) fullResPoints.visible = true
                    if (downsampledPoints) downsampledPoints.visible = false
                    renderer.render(scene, camera)
                }

                let isInteracting;

                const handleInteraction = () => {
                    if (!isInteracting) {
                        showDownsampled();
                        isInteracting = true;
                    }

                    clearTimeout(isInteracting);

                    isInteracting = setTimeout(() => {
                        showFullRes();
                        isInteracting = false;
                    }, 100);
                };

                controls.addEventListener('change', handleInteraction)
            }
        )

        // Initial render
        renderer.render(scene, camera)

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.render(scene, camera)
        }

        window.addEventListener('resize', handleResize)

        // Clean up on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
            mountRef.current.removeChild(renderer.domElement)
            controls.dispose()
        }
    }, [])

    return <div ref={mountRef} />
}

export default App;

// src/plyWorker.js

import * as THREE from "three"
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

onmessage = async function (e) {
    const { fileUrl } = e.data

    // Fetch the PLY file as a Blob
    const response = await fetch(fileUrl)
    const blob = await response.blob()

    // Read the Blob as an ArrayBuffer using FileReader
    const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(blob)
        reader.onloadend = () => resolve(reader.result)
    })

    // Parse the ArrayBuffer using PLYLoader
    const loader = new PLYLoader()
    loader.setCustomPropertyNameMapping({
        dist: ['dist']
    })
    const bufferGeometry = loader.parse(arrayBuffer)

    console.log(bufferGeometry)
    
    // Send the parsed geometry back to the main thread
    const vertices = bufferGeometry.getAttribute('position').array.buffer
    const colors = bufferGeometry.getAttribute('color').array.buffer
    const normals = bufferGeometry.getAttribute('normal').array.buffer

    postMessage({vertices, colors, normals}, [vertices, colors, normals])

}

import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useState } from 'react'
import ModelManager from '@/model-manager'

export default function ThreeScene({ file }: { file: File | null }) {
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  useEffect(() => {
    if (!file) return
    const modelManager = ModelManager.getInstance()
    modelManager
      .loadModel(file)
      .then(() => {
        console.log('model loaded')
        setScene(modelManager.getScene())
      })
      .catch((e) => {
        alert(e)
      })
  }, [file])

  return (
    <Canvas camera={{ fov: 30, position: [5, 5, 5] }}>
      <ambientLight />
      <directionalLight />
      <gridHelper args={[100, 100]} />
      <OrbitControls
        enableDamping
        dampingFactor={0.2}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        panSpeed={0.5}
      />
      {scene && <primitive object={scene} />}
    </Canvas>
  )
}

import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js'

const loadGltf = async (url: string): Promise<GLTF> => {
  const loader = new GLTFLoader()
  return await new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf),
      (progress) => {},
      (error) => reject(error),
    )
  })
}

export { loadGltf }

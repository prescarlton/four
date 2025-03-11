'use client'
import * as THREE from 'three'
import { loadGltf } from '@/utils'

const modelLoadedEvent = new CustomEvent('modelLoaded')

class ModelManager {
  private static instance: ModelManager | null = null
  private scene!: THREE.Scene
  isModelLoaded = false

  private constructor() {
    this.scene = new THREE.Scene()
  }

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager()
    }
    return ModelManager.instance
  }

  getScene = () => {
    return this.scene
  }

  onModelLoaded = (callback: () => void) => {
    if (this.isModelLoaded) {
      callback()
    } else if (typeof document !== 'undefined') {
      document.addEventListener('modelLoaded', callback)
    }
  }

  loadModel = async (file: File) => {
    this.isModelLoaded = false
    if (this.scene.children.length > 0) {
      this.scene.children[0].removeFromParent()
    }

    // three.js does not support loading files directly,
    // so we need to convert the file to a URL
    const url = URL.createObjectURL(file)
    const gltf = await loadGltf(url)
    gltf.scene.traverse((obj) => {
      obj.frustumCulled = true
    })
    this.scene.add(gltf.scene)
    this.scene.position.set(0, 0, 0)
    // make hands invisible
    // const LeftHand = this.scene.getObjectByName('LeftHand')
    // const RightHand = this.scene.getObjectByName('RightHand')
    // LeftHand?.scale.set(0, 0, 0)
    // RightHand?.scale.set(0, 0, 0)
    this.isModelLoaded = true
    // finally, dispatch the event
    if (typeof document !== 'undefined')
      document.dispatchEvent(modelLoadedEvent)
  }

  getBones = () => {
    const bones: THREE.Bone[] = []
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Bone) {
        bones.push(obj)
      }
    })
    return bones
  }
}
export default ModelManager

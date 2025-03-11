'use client'
import BoneControls from '@/components/bone-controls'
import FilePicker from '@/components/file-picker'
import ThreeScene from '@/components/three-scene'
import { useState } from 'react'

export default function Lander() {
  const [file, setFile] = useState<File | null>(null)
  return (
    <div className="relative flex-1">
      <ThreeScene file={file} />
      <FilePicker setFile={setFile} />
      <BoneControls />
    </div>
  )
}

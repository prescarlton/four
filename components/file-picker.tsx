'use client'

import { Card } from './ui/card'
import { Input } from './ui/input'

export default function FilePicker({
  setFile,
}: {
  setFile: (file: File) => void
}) {
  return (
    <Card className="absolute top-4 left-4 z-10 gap-1 p-4">
      <p className="text-primary text-lg">Upload a model</p>
      <Input
        type="file"
        accept=".glb, .gltf"
        onChange={(e) => {
          const file = e.target.files?.item(0)
          if (file) setFile(file)
        }}
      />
    </Card>
  )
}

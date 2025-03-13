import { useEffect, useMemo, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import ModelManager from '@/model-manager'
import { Bone, BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial } from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'

export default function BoneControls() {
  const [selectedBone, setSelectedBone] = useState<Bone | null>(null)
  const [bones, setBones] = useState<Bone[]>([])

  const highlightMesh = useMemo<Mesh>(() => {
    // Create a highlight wireframe box
    const geometry = new BoxGeometry(5, 5, 5) // Adjust based on model size
    // const wireframe = new WireframeGeometry(geometry)
    const material = new MeshBasicMaterial({
      color: 0xffff00,
      // transparent: true,
      opacity: 0.3,
      depthTest: false,
      depthWrite: false,
      side: DoubleSide,
    }) // Yellow wireframe
    const wireframeMesh = new Mesh(geometry, material)
    wireframeMesh.renderOrder = 1
    return wireframeMesh
  }, [])

  const [rotations, setRotations] = useState<{
    [key: string]: { x: number; y: number; z: number }
  }>({})

  const modelManager = ModelManager.getInstance()

  useEffect(() => {
    modelManager.onModelLoaded(() => {
      const newBones = modelManager.getBones()
      setBones(newBones)
      setSelectedBone(newBones[0])
      updateHighlight(newBones[0])
    })
  }, [])

  const updateHighlight = (bone: Bone | null) => {
    // get the mesh closest to the bone
    if (!bone) return
    const currParent = highlightMesh.parent
    if (currParent) {
      currParent.remove(highlightMesh)
    }
    // Attach it to the bone
    bone.add(highlightMesh)
  }

  const handleBoneSelect = (bone: Bone | null) => {
    setSelectedBone(bone)
    updateHighlight(bone)
  }

  const handleRotationChange = (
    bone: Bone,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => {
    const rotation = bone.rotation.clone()
    rotation[axis] = value
    bone.rotation.set(rotation.x, rotation.y, rotation.z)

    setRotations((prev) => ({
      ...prev,
      [bone.name]: {
        x: axis === 'x' ? value : prev[bone.name]?.x || rotation.x,
        y: axis === 'y' ? value : prev[bone.name]?.y || rotation.y,
        z: axis === 'z' ? value : prev[bone.name]?.z || rotation.z,
      },
    }))
  }

  if (!modelManager.isModelLoaded) {
    return null
  }

  return (
    <Card className="absolute top-4 right-4 z-10 w-96">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center justify-between text-lg">
          Bone Controls
          <Badge variant="outline" className="ml-2">
            {bones.length} bones
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4">
            {selectedBone && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">
                  Selected:{' '}
                  <span className="text-primary">{selectedBone.name}</span>
                </h3>
                <div className="space-y-4">
                  {['x', 'y', 'z'].map((axis) => (
                    <div key={axis}>
                      <label className="mb-1 block text-sm font-medium">
                        Rotate {axis.toUpperCase()}
                      </label>
                      <Slider
                        min={degToRad(-180)}
                        max={degToRad(180)}
                        step={0.001}
                        value={[
                          rotations[selectedBone.name]?.[axis] ||
                            selectedBone.rotation[axis] ||
                            0,
                        ]}
                        onValueChange={(value) =>
                          handleRotationChange(
                            selectedBone,
                            axis as 'x' | 'y' | 'z',
                            value[0],
                          )
                        }
                      />
                      <div className="mt-1 flex justify-between">
                        <span className="text-muted-foreground text-xs">
                          {degToRad(-180).toFixed(3)}
                        </span>
                        <span className="text-xs font-medium">
                          {(selectedBone.rotation[axis] || 0).toFixed(3)}°
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {degToRad(180).toFixed(3)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBoneSelect(null)}
                    >
                      Deselect
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full">
              {bones.map((bone, index) => (
                <Button
                  key={index}
                  variant={selectedBone === bone ? 'default' : 'ghost'}
                  className="h-auto w-full justify-start py-2 text-left"
                  onClick={() => handleBoneSelect(bone)}
                >
                  {bone.name}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

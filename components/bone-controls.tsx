import { useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import ModelManager from '@/model-manager'
import { Bone } from 'three'
import { degToRad, radToDeg } from 'three/src/math/MathUtils.js'

export default function BoneControls() {
  const [selectedBone, setSelectedBone] = useState<Bone | null>(null)
  const [bones, setBones] = useState<Bone[]>([])
  const [rotations, setRotations] = useState<{
    [key: string]: {
      x: number
      y: number
      z: number
    }
  }>({})

  const modelManager = ModelManager.getInstance()
  useEffect(() => {
    modelManager.onModelLoaded(() => {
      const newBones = modelManager.getBones()
      setBones(newBones)
      setSelectedBone(newBones[0])
    })
  }, [])

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
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Rotate X
                    </label>
                    <Slider
                      min={degToRad(-180)}
                      max={degToRad(180)}
                      step={0.001}
                      value={[
                        rotations[selectedBone.name]?.x ||
                          selectedBone.rotation.x ||
                          0,
                      ]}
                      onValueChange={(value) =>
                        handleRotationChange(selectedBone, 'x', value[0])
                      }
                    />
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground text-xs">
                        {degToRad(-180).toFixed(3)}
                      </span>
                      <span className="text-xs font-medium">
                        {(selectedBone.rotation.x || 0).toFixed(3)}°
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {degToRad(180).toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Rotate Y
                    </label>
                    <Slider
                      min={degToRad(-180)}
                      max={degToRad(180)}
                      step={0.001}
                      value={[
                        rotations[selectedBone.name]?.y ||
                          selectedBone.rotation.y ||
                          0,
                      ]}
                      onValueChange={(value) =>
                        handleRotationChange(selectedBone, 'y', value[0])
                      }
                    />
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground text-xs">
                        {degToRad(-180).toFixed(3)}
                      </span>
                      <span className="text-xs font-medium">
                        {(selectedBone.rotation.y || 0).toFixed(3)}°
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {degToRad(180).toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Rotate Z
                    </label>
                    <Slider
                      min={degToRad(-180)}
                      max={degToRad(180)}
                      step={0.001}
                      value={[
                        rotations[selectedBone.name]?.z ||
                          selectedBone.rotation.z ||
                          0,
                      ]}
                      onValueChange={(value) =>
                        handleRotationChange(selectedBone, 'z', value[0])
                      }
                    />
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground text-xs">
                        {degToRad(-180).toFixed(3)}
                      </span>
                      <span className="text-xs font-medium">
                        {(selectedBone.rotation.z || 0).toFixed(3)}°
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {degToRad(180).toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // setRotations((prev) => ({
                        //   ...prev,
                        //   [selectedBone]: { x: 0, y: 0, z: 0 },
                        // }))
                      }}
                    >
                      Reset Rotation
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedBone(null)}
                    >
                      Deselect
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="bones"
            >
              <AccordionItem value="bones">
                <AccordionTrigger>Bones List</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-1">
                    {bones.map((bone, index) => (
                      <Button
                        key={index}
                        variant={selectedBone === bone ? 'default' : 'ghost'}
                        className="h-auto w-full justify-start py-2 text-left"
                        onClick={() => {
                          setSelectedBone(bone)
                        }}
                      >
                        {bone.name}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

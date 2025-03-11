import ModelManager from '@/model-manager'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function ModelInfo() {
  const [bonesOpen, setBonesOpen] = useState(false)
  const model = ModelManager.getInstance()
  const bones = model.getBones()
  return (
    <Card className="absolute top-4 right-4 bottom-4 z-10 w-96 gap-1 p-4">
      <CardHeader>
        <CardTitle>Model Info</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Collapsible
          open={bonesOpen}
          onOpenChange={setBonesOpen}
          className="h-full"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <p className="text-primary">Bones ({bones.length})</p>
            {bonesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </CollapsibleTrigger>
          <CollapsibleContent className="">
            {bones.map((bone) => (
              <div
                className="border-border flex h-8 items-center gap-1 border-b"
                key={bone.uuid}
              >
                <p className="text-secondary-foreground text-sm">{bone.name}</p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

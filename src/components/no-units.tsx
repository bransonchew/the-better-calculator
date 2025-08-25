import { BookOpen } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import UnitForm from '@/components/overview/unit-form'
import { Button } from '@/components/ui/button'

export default function NoUnits() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <BookOpen className="w-12 h-12 mb-4 text-muted-foreground"/>
      <h3 className="text-lg font-medium mb-2">
        No units added yet
      </h3>
      <p className="text-muted-foreground text-center mb-4">
        Start by adding your completed units to calculate your GPA and WAM
      </p>
      <Dialog>
        <UnitForm
          trigger={ <Button>Add Your First Unit</Button> }
        />
      </Dialog>
    </div>
  )
}

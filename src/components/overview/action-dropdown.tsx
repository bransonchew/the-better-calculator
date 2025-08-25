'use client'

import { Unit } from '@/lib/schemas'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import UnitForm from '@/components/overview/unit-form'
import { useCourse } from '@/hooks/use-course'

export default function ActionDropdown({ unit, index }: { unit: Unit, index: number }) {

  const { remove, insertAt } = useCourse()

  function handleDelete() {
    // Delete unit
    remove(unit.id)

    // Show toast with undo option
    toast(`${ unit.code } deleted successfully.`, {
      action: {
        label: 'Undo',
        onClick: handleUndo,
      },
    })
  }

  function handleUndo() {
    // Undo delete by re-inserting the unit at the original index
    insertAt(unit, index)
    toast(`${ unit.code } restored.`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted size-8">
          <EllipsisVertical/>
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">

        {/*Edit*/ }
        <UnitForm
          trigger={
            <DropdownMenuItem onSelect={ e => e.preventDefault() }>
              Edit
            </DropdownMenuItem>
          }
          editingUnit={ unit }
        />

        {/*Handbook*/ }
        <Link href={ `https://handbook.monash.edu/${ unit.year }/units/${ unit.code }` }>
          <DropdownMenuItem>
            View in Handbook <ExternalLink/>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator/>

        {/*Delete*/ }
        <DropdownMenuItem variant="destructive" onClick={ handleDelete }>
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

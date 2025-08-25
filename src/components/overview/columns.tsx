import { ColumnDef } from '@tanstack/react-table'
import { Unit } from '@/lib/schemas'
import { Checkbox } from '@/components/ui/checkbox'
import SemBadge from '@/components/overview/sem-badge'
import GradeBadge from '@/components/overview/grade-badge'
import { getGrade } from '@/lib/calculations'
import { Button } from '@/components/ui/button'
import { GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import ActionDropdown from '@/components/overview/action-dropdown'

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      { ...attributes }
      { ...listeners }
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVertical className="text-muted-foreground size-3"/>
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export const columns: ColumnDef<Unit>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={ row.original.id }/>,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={ (value) => table.toggleAllPageRowsSelected(!!value) }
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={ row.getIsSelected() }
          onCheckedChange={ (value) => row.toggleSelected(!!value) }
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: 'Code',
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row: { original: { name } } }) => (
      <div className="md:max-w-60 lg:max-w-96 truncate">{ name }</div>
    ),
  },
  {
    accessorKey: 'creditPoint',
    header: () => (
      <div className="text-center">Credit Point</div>
    ),
    cell: ({ row: { original: { creditPoint } } }) => (
      <div className="text-center font-mono">{ creditPoint }</div>
    ),
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    cell: ({ row: { original: { semester } } }) => (
      <SemBadge semester={ semester }/>
    ),
  },
  {
    accessorKey: 'year',
    header: () => (
      <div className="text-center">Year</div>
    ),
    cell: ({ row: { original: { year } } }) => (
      <div className="text-center font-mono">{ year }</div>
    ),
  },
  {
    accessorKey: 'mark',
    header: () => (
      <div className="text-center">Mark</div>
    ),
    cell: ({ row: { original: { mark } } }) => (
      <div className="text-center font-mono">{ mark }</div>
    ),
  },
  {
    id: 'grade',
    header: 'Grade',
    cell: ({ row: { original: { mark } } }) => (
      <GradeBadge grade={ getGrade(mark).code }/>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ActionDropdown unit={ row.original } index={ row.index }/>
    ),
  },
]

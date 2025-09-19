'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Unit } from '@/lib/schemas'
import { ChangeEvent, useId, useMemo, useRef, useState } from 'react'
import {
  Braces,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns2,
  Import,
  Plus,
  Save,
  Sheet,
  Trash,
} from 'lucide-react'
import { columns } from '@/components/overview/columns'
import UnitForm from '@/components/overview/unit-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import NoUnits from '@/components/no-units'
import { useCourse } from '@/hooks/use-course'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { camelCaseToWords, formatDate } from '@/lib/utils'
import { download } from '@/lib/file'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { z } from 'zod/v4'
import { preprocess } from '@/context/course-provider'

const fileSchema = z.file()
  .mime(['application/json', 'text/csv'], 'Please upload a valid JSON or CSV file')
  .max(5_242_880, 'File size must be less than 5MB')

function DraggableRow({ row }: { row: Row<Unit> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={ row.getIsSelected() && 'selected' }
      data-dragging={ isDragging }
      ref={ setNodeRef }
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={ {
        transform: CSS.Transform.toString(transform),
        transition: transition,
      } }
    >
      { row.getVisibleCells().map((cell) => (
        <TableCell key={ cell.id }>
          { flexRender(cell.column.columnDef.cell, cell.getContext()) }
        </TableCell>
      )) }
    </TableRow>
  )
}

export default function DataTable() {

  // Data table states
  const {
    units: data,
    setUnits: setData,
    removeIds,
    clear,
    lastUpdated,
    toJSON,
    toCSV,
  } = useCourse()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )
  const dataIds = useMemo<UniqueIdentifier[]>(() => (
    data?.map(({ id }) => id) || []
  ), [data])
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData(prev => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  function handleDelete() {
    // No rows selected
    if (!table.getFilteredSelectedRowModel().rows.length) return

    // Delete all rows if selected
    if (table.getIsAllRowsSelected()) clear()

    // Delete selected rows
    removeIds(table.getFilteredSelectedRowModel().rows.map(row => row.id))

    // Remove row selection
    table.resetRowSelection()
  }

  function exportJSON() {
    download(toJSON(), 'units.json', 'application/json')
  }

  function exportCSV() {
    download(toCSV(), 'units.csv', 'text/csv')
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {

    // No file selected
    const file = e.target.files?.[0]
    if (!file) return

    // Reset the input value to allow re-uploading the same file
    e.target.value = ''

    // Validate the file
    const { error } = fileSchema.safeParse(file)
    if (error) {
      error.issues.forEach((issue, index, array) => {
        toast.error(issue.message, {
          duration: (array.length - index) * 4000,  // Stack toasts
          closeButton: true,
        })
      })
      return
    }

    // Read the file content
    const reader = new FileReader()
    reader.onload = () => {
      if (file.type === 'application/json') {
        try {
          const data = JSON.parse(reader.result as string)
          setData(preprocess(data))
          toast.success('Data imported successfully')
        } catch (e) {
          console.error(e)
          toast.error('Failed to parse JSON. Please check the file content.')
        }
      } else if (file.type === 'text/csv') {
        const { data, errors } = Papa.parse(reader.result as string, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        })
        if (!errors.length) {
          setData(preprocess(data as Unit[]))
          toast.success('Data imported successfully')
        } else {
          toast.error('Failed to parse CSV. Please check the file content.')
        }
      }
    }
    reader.onerror = () => {
      toast.error('Failed to read file. Try again.')
    }
    reader.readAsText(file)
  }

  return (
    <div className="relative flex flex-col gap-4 overflow-auto">

      {/*Table actions*/ }
      <div className="flex items-center justify-between -mb-1">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl font-bold">Your Units</h1>
          { lastUpdated &&
              <p className="hidden sm:inline text-xs text-muted-foreground mt-0.5">
                  Last edited: { ' ' }
                { formatDate(new Date(lastUpdated), {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  // Within 24 hours
                  ...(new Date().getTime() - lastUpdated < 86_400_000 && {
                    hour: 'numeric',
                    minute: 'numeric',
                  }),
                }) }
              </p> }
        </div>
        <div className="flex items-center gap-2">

          {/*Delete units*/ }
          <>
            { (table.getIsSomeRowsSelected() || table.getIsAllPageRowsSelected()) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash/>
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete { table.getFilteredSelectedRowModel().rows.length } unit(s)?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={ handleDelete }>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) }
          </>

          {/*File operations*/ }
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save/>
                  <span className="hidden sm:inline">Save</span>
                  <ChevronDown/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Save As</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={ exportJSON }>
                    <Braces/> units.json
                    <div className="ml-auto text-xs text-muted-foreground">
                      Best overall
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={ exportCSV }>
                    <Sheet/> units.csv
                    <div className="ml-auto text-xs text-muted-foreground">
                      For Excel
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={ () => fileInputRef.current?.click() }>
                    <Import/> Import
                    <div className="ml-auto text-xs text-muted-foreground">
                      *.csv / json
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              ref={ fileInputRef }
              type="file"
              className="hidden"
              onChange={ handleFileChange }
            />
          </>

          {/*Customize columns*/ }
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns2/>
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="hidden sm:inline lg:hidden">Columns</span>
                  <ChevronDown/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                { table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== 'undefined' &&
                      column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={ column.id }
                        className="capitalize"
                        checked={ column.getIsVisible() }
                        onCheckedChange={ (value) =>
                          column.toggleVisibility(value)
                        }
                      >
                        { camelCaseToWords(column.id) }
                      </DropdownMenuCheckboxItem>
                    )
                  }) }
              </DropdownMenuContent>
            </DropdownMenu>
          </>

          {/*Add unit*/ }
          <>
            <UnitForm
              trigger={
                <Button variant="outline" size="sm">
                  <Plus/>
                  <span className="hidden sm:inline">Add unit</span>
                </Button>
              }
            />
          </>

        </div>
      </div>

      {/*Table content*/ }
      { table.getRowModel().rows?.length
        ?
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={ closestCenter }
            modifiers={ [restrictToVerticalAxis] }
            onDragEnd={ handleDragEnd }
            sensors={ sensors }
            id={ sortableId }
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                { table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={ headerGroup.id }>
                    { headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={ header.id } colSpan={ header.colSpan }>
                          { header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            ) }
                        </TableHead>
                      )
                    }) }
                  </TableRow>
                )) }
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                <SortableContext
                  items={ dataIds }
                  strategy={ verticalListSortingStrategy }
                >
                  { table.getRowModel().rows.map((row) => (
                    <DraggableRow key={ row.id } row={ row }/>
                  )) }
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
        :
        <NoUnits/> }

      {/*Pagination*/ }
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          { table.getFilteredSelectedRowModel().rows.length } of{ ' ' }
          { table.getFilteredRowModel().rows.length } row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={ `${ table.getState().pagination.pageSize }` }
              onValueChange={ (value) => {
                table.setPageSize(Number(value))
              } }
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={ table.getState().pagination.pageSize }
                />
              </SelectTrigger>
              <SelectContent side="top">
                { [10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={ pageSize } value={ `${ pageSize }` }>
                    { pageSize }
                  </SelectItem>
                )) }
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page { table.getState().pagination.pageIndex + 1 } of{ ' ' }
            { table.getPageCount() }
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={ () => table.setPageIndex(0) }
              disabled={ !table.getCanPreviousPage() }
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft/>
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={ () => table.previousPage() }
              disabled={ !table.getCanPreviousPage() }
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft/>
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={ () => table.nextPage() }
              disabled={ !table.getCanNextPage() }
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight/>
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={ () => table.setPageIndex(table.getPageCount() - 1) }
              disabled={ !table.getCanNextPage() }
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight/>
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { rawUnit, RawUnit, Unit } from '@/lib/schemas'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getGrade, getWeightedCreditPoints } from '@/lib/calculations'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReactNode, useEffect, useState } from 'react'
import { useCourse } from '@/hooks/use-course'
import { SemesterCode, Semesters } from '@/lib/constants'
import InfoTooltip from '@/components/overview/info-tooltip'

const startingYear = 2008

const commonSemesters: SemesterCode[] = [
  'S1-01',
  'S2-01',
  'SSA-02',
  'SSB-01',
  'NOV12',
]

const otherSemesters = Array.from(new Set(Object.keys(Semesters) as SemesterCode[]).difference(new Set(commonSemesters))).toSorted()

const gradeString = (mark: number) => {
  try {
    const grade = getGrade(mark)
    return `${ grade.title } (${ grade.code })`
  } catch (e) {
    return 'N/A'
  }
}

type UnitFormProps = {
  trigger: ReactNode
  editingUnit?: Unit
}

export default function UnitForm({ trigger, editingUnit }: UnitFormProps) {

  // Form setup
  const form = useForm<RawUnit>({
    resolver: zodResolver(rawUnit),
    defaultValues: editingUnit ?? {
      creditPoint: 6,
      semester: new Date().getMonth() > 5 ? 'S1-01' : 'S2-01',
      year: new Date().getFullYear(),
    },
  })
  const { watch, formState, reset } = form
  const watchCode = watch('code')

  // Dialog state
  const [open, setOpen] = useState(false)

  // Unit manipulation
  const { insert, update } = useCourse()

  // Handle form submission
  function onSubmit(values: RawUnit) {
    if (editingUnit) {
      update({ ...values, id: editingUnit.id })
    } else {
      insert(values)
    }
  }

  // Reset form and close dialog on successful submission
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      setOpen(false)
      reset()
    }
  }, [formState.isSubmitSuccessful, reset])

  return (
    <Dialog open={ open } onOpenChange={ setOpen }>
      <DialogTrigger asChild>
        { trigger }
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <Form { ...form }>
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="space-y-6"
          >
            <DialogHeader>
              <DialogTitle>Add Unit</DialogTitle>
              <DialogDescription>
                Enter the details of your unit enrolment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-3">

              <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">

                {/* Unit Code */ }
                <FormField
                  control={ form.control }
                  name="code"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., FIT2004" { ...field } />
                      </FormControl>
                      <FormDescription>
                        Unit level: { watchCode?.[3] ?? 'na' }
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  ) }
                />

                {/* Credit Points */ }
                <FormField
                  control={ form.control }
                  name="creditPoint"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Points</FormLabel>
                      <FormControl>
                        <Input
                          { ...field }
                          type="number"
                          onChange={ e => field.onChange(
                            Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)
                          }
                          min={ 0 }
                          max={ 48 }
                          step={ 1 }
                          placeholder="e.g., 6"
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-2">
                        Weighted credit points: { ' ' }
                        { watchCode?.[3] && field.value
                          ? getWeightedCreditPoints(watchCode, field.value)
                          : 'na' }
                        <InfoTooltip>
                          <p>Level 1 units weigh half their credit points.</p>
                        </InfoTooltip>
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  ) }
                />

              </div>

              <FormField
                control={ form.control }
                name="name"
                render={ ({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Algorithms and Data Structures"
                        { ...field }
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                ) }
              />

              <div className="grid grid-cols-2 items-start gap-4">

                {/*Mark*/ }
                <FormField
                  control={ form.control }
                  name="mark"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Mark</FormLabel>
                      <FormControl>
                        <Input
                          { ...field }
                          type="number"
                          onChange={ e => field.onChange(
                            Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)
                          }
                          min={ 0 }
                          max={ 100 }
                          step={ 1 }
                          placeholder="e.g., 85"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  ) }
                />

                {/*Grade*/ }
                <FormField
                  control={ form.control }
                  name="mark"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <FormControl>
                        <Input
                          value={ gradeString(field.value || 80) }
                          disabled
                          className="truncate"
                        />
                      </FormControl>
                    </FormItem>
                  ) }
                />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">

                {/*Semester*/ }
                <FormField
                  control={ form.control }
                  name="semester"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select
                        onValueChange={ field.onChange }
                        defaultValue={ field.value }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select semester"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-96">
                          <SelectGroup>
                            <SelectLabel>Main</SelectLabel>
                            { commonSemesters.map(sem => (
                              <SelectItem key={ sem } value={ sem }>
                                { Semesters[sem].name } ({ sem })
                              </SelectItem>
                            )) }
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Others</SelectLabel>
                            { otherSemesters.map(sem => (
                              <SelectItem key={ sem } value={ sem }>
                                { Semesters[sem].name } ({ sem })
                              </SelectItem>
                            )) }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  ) }
                />

                {/* Year */ }
                <FormField
                  control={ form.control }
                  name="year"
                  render={ ({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        value={ field.value?.toString() ?? '' }
                        onValueChange={ val => field.onChange(
                          val === '' ? undefined : Number(val),
                        ) }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select starting year"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-96">
                          { Array.from({ length: new Date().getFullYear() - startingYear + 1 }, (_, i) => (
                            <SelectItem key={ i } value={ (startingYear + i).toString() }>
                              { startingYear + i }
                            </SelectItem>
                          )) }
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  ) }
                />

              </div>

            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={ editingUnit && !formState.isDirty }
              >
                { editingUnit ? 'Save changes' : 'Add Unit' }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

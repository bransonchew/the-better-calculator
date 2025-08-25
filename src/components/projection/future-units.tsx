'use client'

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { FutureUnit, futureUnit } from '@/lib/schemas'
import { z } from 'zod/v4'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'

type FutureUnitsProps = {
  defaultValues?: FutureUnit[]
  setFutureUnitsAction: Dispatch<SetStateAction<FutureUnit[]>>
}

const formSchema = z.object({
  rows: futureUnit.array(),
})

type FormSchema = z.infer<typeof formSchema>

export default function FutureUnits({ defaultValues, setFutureUnitsAction }: FutureUnitsProps) {

  // Array Form
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: (defaultValues && defaultValues.length)
        ? defaultValues
        : Array(4).fill({ creditPoint: 6, mark: 80 }),
    },
  })
  const { control, handleSubmit, formState } = form
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'rows',
  })

  // Future units added
  const [count, setCount] = useState(0)

  function handleAdd() {
    append({
      code: '',
      creditPoint: 6,
      mark: 80,
    })
  }

  function handleDelete(index: number) {
    if (fields.length === 1) {
      replace([{
        code: '',
        creditPoint: 0,
        mark: 0,
      }])
      return
    }
    remove(index)
  }

  function onSubmit(data: FormSchema) {
    setFutureUnitsAction(data.rows)
    setCount(data.rows.length)
  }

  return (
    <Form { ...form }>
      <form onSubmit={ handleSubmit(onSubmit) }>
        <Card>
          <CardHeader>
            <CardTitle>Future Units</CardTitle>
            <CardDescription>Enter unit with estimated marks</CardDescription>
            <CardAction>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={ handleAdd }
              >
                Add unit
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 divide-y min-h-64">
              { fields.map((field, index) => (
                <div
                  key={ field.id }
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 md:gap-3 items-start pb-3 last:pb-0 group"
                >
                  <FormField
                    control={ control }
                    name={ `rows.${ index }.code` }
                    render={ ({ field }) => (
                      <FormItem>
                        <FormLabel className={ cn(index > 0 && 'hidden') }>
                          Code
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="FIT2004" { ...field }/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    ) }
                  />
                  <FormField
                    control={ control }
                    name={ `rows.${ index }.creditPoint` }
                    render={ ({ field }) => (
                      <FormItem>
                        <FormLabel className={ cn(index > 0 && 'hidden') }>
                          Credit Point
                        </FormLabel>
                        <FormControl>
                          <Input
                            { ...field }
                            type="number"
                            onChange={ e => field.onChange(
                              Number.isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)
                            }
                            min={ 0 }
                            step={ 1 }
                            placeholder="6"
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    ) }
                  />
                  <FormField
                    control={ control }
                    name={ `rows.${ index }.mark` }
                    render={ ({ field }) => (
                      <FormItem>
                        <FormLabel className={ cn(index > 0 && 'hidden') }>
                          Mark
                        </FormLabel>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="-mx-3 group-first:self-end"
                    onClick={ () => handleDelete(index) }
                  >
                    <X/>
                  </Button>
                </div>
              )) }
            </div>
          </CardContent>
          <CardFooter className="-mt-3">
            <div className="flex w-full items-center justify-between">
              <div className="text-sm text-muted-foreground">
                { count } unit(s) added.
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={ !defaultValues && !formState.isDirty }
              >
                Calculate
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

import { futureUnit, FutureUnit } from '@/lib/schemas'
import { useLocalStorage } from 'usehooks-ts'

export function useFutureUnits() {
  const [futureUnits, setFutureUnits] = useLocalStorage<FutureUnit[]>('future-units', [], {
    deserializer: value => {
      const arr = JSON.parse(value) as FutureUnit[]

      // Reject non-arrays
      if (!Array.isArray(arr) || !arr.length) return []

      // Parse units & add UUID if none
      return arr.reduce<FutureUnit[]>((acc, curr) => {
        const { success, data } = futureUnit.safeParse(curr)

        // Reject invalid units
        if (success) acc.push(data)

        return acc
      }, [])
    },
  })

  return [futureUnits, setFutureUnits] as const
}

import { useState, useEffect } from 'react'

export default function useHash() {
  const [hash, setHash] = useState(window.location.hash)

  // Detect url hashes
  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return hash
}

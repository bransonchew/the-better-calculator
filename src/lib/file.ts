type FileType = 'text/csv' | 'application/json'

export function download(data: string, fileName: string, fileType: FileType) {
  // Create Blob
  const jsonData = new Blob([data], { type: fileType })

  // Click & remove temp anchor element
  const a = document.createElement('a')
  a.href = URL.createObjectURL(jsonData)
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

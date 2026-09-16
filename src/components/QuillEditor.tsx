import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

function compressImage(file: File, onReady: (dataUrl: string) => void) {
  const reader = new FileReader()
  reader.onload = () => {
    const image = new Image()
    image.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
      onReady(canvas.toDataURL('image/jpeg', 0.7))
    }
    image.src = String(reader.result)
  }
  reader.readAsDataURL(file)
}

export default function QuillEditor({ value, onChange, placeholder }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const editorHost = containerRef.current
    editorHost.parentElement?.querySelectorAll(':scope > .ql-toolbar').forEach(toolbar => toolbar.remove())
    editorHost.innerHTML = ''

    const quill = new Quill(editorHost, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean'],
        ],
      },
    })

    quillRef.current = quill
    quill.clipboard.dangerouslyPasteHTML(value || '')
    quill.on('text-change', () => onChange(quill.root.innerHTML))

    const toolbar = quill.getModule('toolbar') as { addHandler: (name: string, handler: () => void) => void }
    toolbar.addHandler('image', () => imageInputRef.current?.click())

    return () => {
      quill.off('text-change')
      quillRef.current = null
      editorHost.parentElement?.querySelectorAll(':scope > .ql-toolbar').forEach(toolbar => toolbar.remove())
      editorHost.innerHTML = ''
      editorHost.className = ''
    }
  }, [])

  useEffect(() => {
    const quill = quillRef.current
    if (!quill || quill.root.innerHTML === value) return
    const selection = quill.getSelection()
    quill.clipboard.dangerouslyPasteHTML(value || '')
    if (selection) quill.setSelection(selection)
  }, [value])

  return (
    <div className="siskota-quill" style={{ backgroundColor: '#f7f2ea' }}>
      <div ref={containerRef} />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={event => {
          const file = event.target.files?.[0]
          if (file && file.type.startsWith('image/') && quillRef.current) {
            compressImage(file, dataUrl => {
              const quill = quillRef.current
              if (!quill) return
              const range = quill.getSelection(true)
              quill.insertEmbed(range?.index ?? quill.getLength(), 'image', dataUrl, 'user')
              quill.setSelection((range?.index ?? quill.getLength()) + 1)
            })
          }
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
}

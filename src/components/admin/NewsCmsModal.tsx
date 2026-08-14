import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

interface Props {
  open: boolean
  onClose: () => void
  onSave?: (data: { title: string; body: string }) => void
}

export default function NewsCmsModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSave = () => {
    onSave?.({ title, body })
    setTitle('')
    setBody('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="News / CMS">
      <div className="space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[120px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  )
}

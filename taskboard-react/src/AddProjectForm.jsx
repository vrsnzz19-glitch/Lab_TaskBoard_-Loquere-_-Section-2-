import { useState } from 'react'
import { api } from './api'

export default function AddProjectForm({ onProjectAdded }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = await api('/projects', {
        method: 'POST',
        body: { name, description: description || null },
      })
      onProjectAdded(data.data ?? data)
      setName('')
      setDescription('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a project</h2>
      <input aria-label="Project name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Project name" required />
      <textarea aria-label="Project description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add project'}
      </button>
    </form>
  )
}

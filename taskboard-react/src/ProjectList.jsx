import { useEffect, useState } from 'react'
import { api } from './api'
import AddProjectForm from './AddProjectForm'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    api('/projects')
      .then((data) => {
        if (isMounted) setProjects(data.data ?? data)
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  function addProject(project) {
    setProjects((currentProjects) => [project, ...currentProjects])
  }

  return (
    <section>
      <AddProjectForm onProjectAdded={addProject} />
      <h2>Your projects</h2>
      {isLoading && <p>Loading projects...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && projects.length === 0 && <p>No projects yet.</p>}
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.name}</strong>
            <span>{project.tasks_count ?? 0} tasks</span>
            {project.description && <p>{project.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

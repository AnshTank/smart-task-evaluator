// BROKEN COMPONENT - This component has multiple issues that need AI fixing
import React from 'react'

interface TaskCardProps {
  task: any // Bad: using any type
  onDelete: (id: string) => void
}

// Missing export, component name doesn't match file
function TaskCard({ task, onDelete }: TaskCardProps) {
  // Bug: Missing null check
  const handleDelete = () => {
    onDelete(task.id)
  }

  // Bug: Inline styles instead of Tailwind
  return (
    <div style={{ padding: '16px', border: '1px solid gray' }}>
      {/* Bug: Missing null/undefined checks */}
      <h3>{task.title.toUpperCase()}</h3>
      <p>{task.description}</p>
      
      {/* Bug: Accessibility issues - no aria-label, improper button */}
      <div onClick={handleDelete} style={{ cursor: 'pointer', color: 'red' }}>
        Delete
      </div>
      
      {/* Bug: Hardcoded status instead of dynamic */}
      <span>Status: Pending</span>
      
      {/* Bug: Missing key prop in map, potential XSS */}
      {task.tags && task.tags.map((tag: any, index: number) => (
        <span key={index} dangerouslySetInnerHTML={{ __html: tag }}></span>
      ))}
    </div>
  )
}

// Bug: Not exporting the component
// export default TaskCard
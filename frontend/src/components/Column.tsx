import React from 'react'
import type { Column as ColumnType, Job, ColumnType as ColumnTypeEnum } from '../types'
import JobCard from './JobCard'

interface ColumnProps {
  column: ColumnType
  onMoveJob: (jobId: string, source: ColumnTypeEnum, destination: ColumnTypeEnum) => void
  onEditJob: (job: Job) => void
  onDeleteJob: (jobId: string, columnId: ColumnTypeEnum) => void
}

const Column: React.FC<ColumnProps> = ({ column, onMoveJob, onEditJob, onDeleteJob }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    if (data.sourceColumn !== column.id) {
      onMoveJob(data.jobId, data.sourceColumn, column.id)
    }
  }

  return (
    <div
      className="flex flex-col min-w-[300px] h-full bg-gray-50 rounded-md"
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      <div
        className="p-3 text-white rounded-t-md flex items-center"
        style={{ backgroundColor: column.color }}>
        <h2 className="font-medium">{column.title}</h2>
        <div className="ml-2 px-2 py-0.5 bg-white text-black bg-opacity-30 rounded-full text-xs">{column.jobs.length}</div>
      </div>

      <div className="p-2 text-xs text-gray-500">{column.description}</div>

      <div className="flex-1 p-2 overflow-y-auto">
        {column.jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            columnId={column.id}
            onMoveJob={onMoveJob}
            onEditJob={onEditJob}
            onDeleteJob={onDeleteJob}
            columnColor={column.color}
          />
        ))}

        {column.jobs.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-gray-400 text-sm">No jobs in this column</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Column

import React, { useState } from 'react'
import type { Job, ColumnType } from '../types'
import { formatDate } from '../utils'
import { ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react'

interface JobCardProps {
  job: Job
  columnId: ColumnType
  onMoveJob: (jobId: string, source: ColumnType, destination: ColumnType) => void
  onEditJob: (job: Job) => void
  onDeleteJob: (jobId: string, columnId: ColumnType) => void
  columnColor: string
}

const JobCard: React.FC<JobCardProps> = ({ job, columnId, onMoveJob, onEditJob, onDeleteJob, columnColor }) => {
  const [expanded, setExpanded] = useState(false)
  const validMoves = {
    wishlist: ['applied', 'rejected'],
    applied: ['interview', 'rejected'],
    interview: ['offer', 'rejected'],
    offer: ['rejected'],
    rejected: [],
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        jobId: job.id,
        sourceColumn: columnId,
      })
    )
  }

  return (
    <div
      className="bg-white rounded-lg shadow mb-3 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1"
      draggable
      onDragStart={handleDragStart}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{job.positionTitle}</h3>
            <p className="text-sm text-gray-600">{job.companyName}</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: columnColor }}
          />
          <span className="text-xs text-gray-500">Updated {formatDate(job.updatedAt)}</span>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 text-sm">
            {job.location && (
              <div>
                <h4 className="font-medium text-gray-700">Location</h4>
                <p className="text-gray-600 mt-1">{job.location}</p>
              </div>
            )}
            {job.salaryRange && (
              <div>
                <h4 className="font-medium text-gray-700">Salary Range</h4>
                <p className="text-gray-600 mt-1">{job.salaryRange}</p>
              </div>
            )}
            {job.contactPerson && (
              <div>
                <h4 className="font-medium text-gray-700">Contact</h4>
                <p className="text-gray-600 mt-1">
                  {job.contactPerson} ({job.contactEmail})
                </p>
              </div>
            )}

            {job.notes && (
              <div>
                <h4 className="font-medium text-gray-700">Notes</h4>
                <p className="text-gray-600 mt-1">{job.notes}</p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="space-x-2">
                <button
                  onClick={() => onEditJob(job)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  <Edit
                    size={14}
                    className="mr-1"
                  />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteJob(job.id, columnId)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  <Trash
                    size={14}
                    className="mr-1"
                  />
                  Delete
                </button>
              </div>

              {validMoves[columnId].length > 0 && (
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <span className="text-xs text-gray-500">Move to:</span>
                  {validMoves[columnId].map(col => (
                    <button
                      key={col}
                      onClick={() => onMoveJob(job.id, columnId, col as ColumnType)}
                      className={`px-2 py-1 text-xs rounded text-white transition-colors duration-200 ${
                        col === 'rejected'
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : col === 'offer'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : col === 'interview'
                          ? 'bg-pink-600 hover:bg-pink-700'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}>
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCard

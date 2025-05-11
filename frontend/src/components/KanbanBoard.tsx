import React, { useState } from 'react'
import type { Job, ColumnType } from '../types'
import Column from './Column'
import AddJobForm from './AddJobForm'
import EditJobModal from './EditJobModal'
import { PlusCircle } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ofetch } from 'ofetch'
import Header from './Header'
import { useDebounce } from '@uidotdev/usehooks'

const KanbanBoard: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const getAllJobs = async () => {
    const res = await fetch('/api/jobs/all')
    return await res.json()
  }

  const getAllJobsQuery = useQuery({
    queryKey: ['all_jobs_user_1'],
    queryFn: getAllJobs,
  })

  const moveJobToNewColumn = useMutation({
    mutationFn: async (variables: { jobId: string; destination: ColumnType }) => {
      const res = await ofetch(`/api/jobs/move/${variables.jobId}`, {
        method: 'PUT',
        body: {
          jobId: Number(variables.jobId),
          destination: variables.destination,
        },
      })
      if (res.success) {
        return res
      }
      throw new Error('Failed to move job')
    },
    onSuccess: () => {
      getAllJobsQuery.refetch()
    },
  })

  const addNewJob = useMutation({
    mutationFn: async (variables: { job: Job }) => {
      const res = await ofetch(`/api/jobs/new`, {
        method: 'POST',
        body: {
          companyName: variables.job.companyName,
          positionTitle: variables.job.positionTitle,
          status: variables.job.status,
          applicationDate: variables.job.applicationDate,
          location: variables.job.location,
          salaryRange: variables.job.salaryRange,
          contactPerson: variables.job.contactPerson,
          contactEmail: variables.job.contactEmail,
          notes: variables.job.notes,
        },
      })
      if (res.success) {
        return res
      }
      throw new Error('Failed to move job')
    },
    onSuccess: () => {
      getAllJobsQuery.refetch()
    },
  })

  const deleteJobMutation = useMutation({
    mutationFn: async (variables: { jobId: string }) => {
      const res = await ofetch(`/api/jobs/delete?jobId=${variables.jobId}`, {
        method: 'DELETE',
      })
      if (res.success) {
        return res
      }
      throw new Error('Failed to delete job')
    },
    onSuccess: () => {
      getAllJobsQuery.refetch()
    },
  })

  const searchResultsQuery = useQuery({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: () => fetchSearchResults(debouncedSearchTerm),
  })

  const fetchSearchResults = async (term: string) => {
    const response = await ofetch(`/api/jobs/search?searchTerm=${encodeURIComponent(term)}`)
    if (!response.success) {
      throw new Error('Search failed')
    }
    return response
  }

  const handleMoveJob = (jobId: string, source: ColumnType, destination: ColumnType) => {
    if (source === destination) return

    moveJobToNewColumn.mutate({
      jobId,
      destination,
    })
  }

  const handleAddJob = (job: Job) => {
    addNewJob.mutate({ job })
    setEditingJob(null)
    setEditingColumn(null)
  }

  const updateJobMutation = useMutation({
    mutationFn: async (variables: Job & { id: string }) => {
      const res = await ofetch(`/api/jobs/update/${variables.id}`, {
        method: 'PUT',
        body: variables,
      })

      if (res.success) {
        return res
      }
      throw new Error('Failed to update job')
    },
    onSuccess: () => {
      getAllJobsQuery.refetch()
      setEditingJob(null)
    },
  })

  const handleEditJob = (job: Job) => {
    updateJobMutation.mutate({
      ...job,
      id: job.id.toString(),
    })
  }

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJobMutation.mutate({ jobId })
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="flex-1 overflow-hidden p-4 flex flex-col">
        <div className="max-w-full mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">Your Job Applications</h2>

            <button
              onClick={() => {
                setEditingJob(null)
                setEditingColumn(null)
                setIsFormVisible(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Job
            </button>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-4 h-[calc(100vh-160px)]">
            {(() => {
              if (debouncedSearchTerm && searchResultsQuery.data?.success) {
                return Object.values(searchResultsQuery.data.columns || {}).map((column: any) => (
                  <Column
                    key={column.id}
                    column={column}
                    onMoveJob={handleMoveJob}
                    onEditJob={handleEditJob}
                    onDeleteJob={handleDeleteJob}
                    searchTerm={debouncedSearchTerm}
                  />
                ))
              }

              if (getAllJobsQuery.data?.columns) {
                return Object.values(getAllJobsQuery.data.columns).map((column: any) => (
                  <Column
                    key={column.id}
                    column={column}
                    onMoveJob={handleMoveJob}
                    onEditJob={handleEditJob}
                    onDeleteJob={handleDeleteJob}
                    searchTerm={debouncedSearchTerm}
                  />
                ))
              }

              return 'Loading...'
            })()}
          </div>
        </div>
      </main>

      {isFormVisible && (
        <AddJobForm
          onAddJob={handleAddJob}
          onClose={() => setIsFormVisible(false)}
          editingJob={editingJob}
          editingColumn={editingColumn}
        />
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onUpdate={updatedJob => {
            handleEditJob(updatedJob)
          }}
        />
      )}
    </div>
  )
}

export default KanbanBoard

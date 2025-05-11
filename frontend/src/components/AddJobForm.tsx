import React, { useState, useEffect } from 'react'
import type { Job, ColumnType } from '../types'
import { generateId } from '../utils'
import { X } from 'lucide-react'

interface AddJobFormProps {
  onAddJob: (job: Job) => void
  onClose: () => void
  editingJob: Job | null
  editingColumn: ColumnType | null
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onAddJob, onClose, editingJob, editingColumn }) => {
  const [job, setJob] = useState<Partial<Job>>({
    companyName: '',
    positionTitle: '',
    status: 'Wishlist',
    applicationDate: '',
    location: '',
    salaryRange: '',
    contactPerson: '',
    contactEmail: '',
    notes: '',
  })
  const [column, setColumn] = useState<ColumnType>('wishlist')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingJob) {
      setJob({
        id: editingJob.id,
        companyName: editingJob.companyName,
        positionTitle: editingJob.positionTitle,
        status: editingJob.status,
        applicationDate: editingJob.applicationDate,
        location: editingJob.location,
        salaryRange: editingJob.salaryRange,
        contactPerson: editingJob.contactPerson,
        contactEmail: editingJob.contactEmail,
        notes: editingJob.notes,
        createdAt: editingJob.createdAt,
        updatedAt: editingJob.updatedAt,
      })
    }

    if (editingColumn) {
      setColumn(editingColumn)
    }
  }, [editingJob, editingColumn])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!job.companyName?.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!job.positionTitle?.trim()) {
      newErrors.positionTitle = 'Position title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const now = new Date()
    const updatedJob: Job = {
      id: job.id || generateId(),
      companyName: job.companyName || '',
      positionTitle: job.positionTitle || '',
      status: job.status || 'Wishlist',
      applicationDate: job.applicationDate || '',
      location: job.location || '',
      salaryRange: job.salaryRange || '',
      contactPerson: job.contactPerson || '',
      contactEmail: job.contactEmail || '',
      notes: job.notes || '',
      createdAt: job.createdAt || now,
      updatedAt: now,
    }

    onAddJob(updatedJob)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setJob(prev => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title*</label>
              <input
                type="text"
                name="companyName"
                value={job.companyName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Frontend Developer"
              />
              {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company*</label>
              <input
                type="text"
                name="positionTitle"
                value={job.positionTitle}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.positionTitle ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Frontend Developer"
              />
              {errors.positionTitle && <p className="mt-1 text-sm text-red-600">{errors.positionTitle}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Application Date</label>
              <input
                type="date"
                name="applicationDate"
                value={job.applicationDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={job.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={job.salaryRange}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., $80,000 - $100,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={job.contactPerson}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={job.contactEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., john.smith@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={job.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Any additional notes, contact details, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={column}
                onChange={e => setColumn(e.target.value as ColumnType)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button
              onClick={() => {
                setJob({
                  companyName: 'Example Corp',
                  positionTitle: 'Software Engineer',
                  status: 'Wishlist',
                  applicationDate: new Date().toISOString().split('T')[0],
                  location: 'San Francisco, CA',
                  salaryRange: '$120,000 - $150,000',
                  contactPerson: 'Jane Smith',
                  contactEmail: 'jane.smith@example.com',
                  notes: 'Great company culture, growing team',
                })
              }}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Prefill Demo Data
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {editingJob ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddJobForm

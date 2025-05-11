export interface Job {
  id: string
  companyName: string
  positionTitle: string
  status: string
  applicationDate: string
  location: string
  salaryRange: string
  contactPerson: string
  contactEmail: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

export type ColumnType = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'

export interface Column {
  id: ColumnType
  title: string
  description: string
  color: string
  jobs: Job[]
}

export interface AppState {
  columns: Record<ColumnType, Column>
  searchTerm: string
}

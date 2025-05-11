interface Job {
  id: string
  companyName: string
  positionTitle: string
  url: string
  description: string
  applicationDate: string
  status: string
  location: string
  salaryRange: string
  contactPerson: string
  contactEmail: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

interface Column {
  id: string
  title: string
  description: string
  color: string
  jobs: Job[]
}

export interface Columns {
  wishlist: Column
  applied: Column
  interview: Column
  offer: Column
  rejected: Column
  [key: string]: Column // For any additional columns that might be added
}

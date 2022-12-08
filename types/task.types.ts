export interface TaskStatus {
  name: string
  bg: string
  text: string
}

export interface Task {
  id: string
  title: string
  description: string
  folderId: string
  parentId: string | null
  status: TaskStatus
}

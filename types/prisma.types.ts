/**
 * Model User
 *
 */
export type User = {
  id: string
  displayName: string
  email: string
  password: string
}

/**
 * Model Task
 *
 */
export type Task = {
  id: string
  title: string
  description: string
  status: string
  createdAt: Date
  userId: string
  parentId: string | null
  storyPoints: number | null
  priority: string | null
  folderId: string | null
}

/**
 * Model Folder
 *
 */
export type Folder = {
  id: string
  title: string
  createdAt: Date
  userId: string
  parentId: string | null
  sharedWith: User[]
}

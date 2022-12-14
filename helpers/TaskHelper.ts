import { Task } from "../types/prisma.types"

export const TaskHelper = {
  isTopLevel(input: Task[], id: string): boolean {
    return input.filter((task) => task.id === id)[0]?.parentId === null
  },
  hasChildren(input: Task[], id: string): boolean {
    return input.filter((task) => task.parentId === id).length > 0
  },
  isSame(input: Task, id: string): boolean {
    return input.id === id
  },
  isIn(input: Task[], id: string): boolean {
    return input
      .map((task) => {
        return task.id
      })
      .includes(id)
  },
  findTask(input: Task[], id: string): Task {
    return input.filter((task) => task.id === id)[0]
  },
  findParent(input: Task[], id: string): Task {
    return input.filter(
      (task) =>
        task.id ===
        input.filter((subCategory) => subCategory.id === id)[0].parentId
    )[0]
  },
  findDeepParents(input: Task[], id: string) {
    const parents: Task[] = []

    if (!this.isTopLevel(input, id)) {
      parents.push(this.findParent(input, id))

      while (!this.isTopLevel(input, parents[parents.length - 1].id)) {
        if (!this.isTopLevel(input, parents[parents.length - 1].id)) {
          parents.push(this.findParent(input, parents[parents.length - 1].id))
        }
      }
    }

    return parents
  },
  findTopLevel(input: Task[]): Task[] {
    return input.filter((task) => task.parentId === null)
  },
  findChildren(input: Task[], id: string): Task[] {
    return input.filter((task) => task.parentId === id)
  },
  findDeepChildren(input: Task[], id: string): Task[] {
    const children: Task[] = []

    children.push(...this.findChildren(input, id))

    children.forEach((child) =>
      children.push(...this.findChildren(input, child.id))
    )

    return children
  },
}

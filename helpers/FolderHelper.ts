import { Folder } from "../types/prisma.types"

export const FolderHelper = {
  isTopLevel(input: Folder[], id: string): boolean {
    return input.filter((folder) => folder.id === id)[0]?.parentId === null
  },
  hasChildren(input: Folder[], id: string): boolean {
    return input.filter((folder) => folder.parentId === id).length > 0
  },
  isSame(input: Folder, id: string): boolean {
    return input.id === id
  },
  isIn(input: Folder[], id: string): boolean {
    return input
      .map((folder) => {
        return folder.id
      })
      .includes(id)
  },
  findFolder(input: Folder[], id: string): Folder {
    return input.filter((folder) => folder.id === id)[0]
  },
  findParent(input: Folder[], id: string): Folder {
    return input.filter(
      (folder) =>
        folder.id ===
        input.filter((subfolder) => subfolder.id === id)[0].parentId
    )[0]
  },
  findDeepParents(input: Folder[], id: string) {
    const parents: Folder[] = []

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
  findTopLevel(input: Folder[]): Folder[] {
    return input.filter((folder) => folder.parentId === null)
  },
  findChildren(input: Folder[], id: string): Folder[] {
    return input.filter((folder) => folder.parentId === id)
  },
  findDeepChildren(input: Folder[], id: string): Folder[] {
    const children: Folder[] = []

    children.push(...this.findChildren(input, id))

    children.forEach((child) =>
      children.push(...this.findChildren(input, child.id))
    )

    return children
  },
}

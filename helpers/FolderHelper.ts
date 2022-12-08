import { Folder } from "../types/folder.types"

export const FolderHelper = {
  isTopLevel(input: Folder[], id: string): boolean {
    return input.find((folder) => folder.id === id)?.parentFolderId === null
  },
  hasChildren(input: Folder[], id: string): boolean {
    return input.filter((folder) => folder.parentFolderId === id).length > 0
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
        input.filter((subCategory) => subCategory.id === id)[0].parentFolderId
    )[0]
  },
  findDeepParents(input: Folder[], id: string): Folder[] {
    const parents: Folder[] = []

    if (!this.isTopLevel(input, id)) {
      parents.push(this.findParent(input, id))
      parents.forEach((parent) => {
        if (!this.isTopLevel(input, parent.id)) {
          parents.push(this.findParent(input, parent.id))
        }
      })
    }

    return parents
  },
  findTopLevel(input: Folder[]): Folder[] {
    return input.filter((category) => category.parentFolderId === null)
  },
  findChildren(input: Folder[], id: string): Folder[] {
    return input.filter((category) => category.parentFolderId === id)
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
interface OpenParams {
  eventId: number
  restaurantId: number
  productId: number
  assignedBranches: any[]
}

let externalOpen: ((params: OpenParams) => void) | null = null

export const BranchesModal = {
  open(params: OpenParams) {
    externalOpen?.(params)
  }
}

export function setBranchesModalOpen(fn: ((params: OpenParams) => void) | null) {
  externalOpen = fn
}

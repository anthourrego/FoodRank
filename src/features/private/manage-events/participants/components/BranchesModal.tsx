import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import restaurantBranchService from "@/features/private/restaurant/services/RestaurantBranchService"
import { useQuery } from "@tanstack/react-query"
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents"
import type { RestaurantBranch, RestaurantBranchesResponse } from "@/features/private/restaurant/types/restaurant-branch.types"

interface OpenParams {
  eventId: number
  restaurantId: number
  productId: number
}

let externalOpen: ((params: OpenParams) => void) | null = null

export function BranchesModalInternal() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState<OpenParams | null>(null)
  const [selected, setSelected] = useState<number[]>([])

  const { useSaveBranchesForProductEventMutation } = useQueryServiceEvents()
  const saveMutation = useSaveBranchesForProductEventMutation(params?.eventId ?? 0, params?.productId ?? 0)

  const { data: branchesResp } = useQuery<RestaurantBranchesResponse>({
    enabled: open && !!params?.restaurantId,
    queryKey: ["restaurant-branches", { restaurantId: params?.restaurantId }],
    queryFn: () => restaurantBranchService.getAll({ restaurant_id: String(params!.restaurantId), per_page: 200 }),
  })

  const branches = useMemo<RestaurantBranch[]>(() => branchesResp?.data ?? [], [branchesResp])

  useEffect(() => {
    externalOpen = (p: OpenParams) => {
      setParams(p)
      setSelected([])
      setOpen(true)
    }
    return () => { externalOpen = null }
  }, [])

  function toggle(id: number, checked: boolean) {
    setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id))
  }

  async function onSave() {
    if (!params) return
    await saveMutation.mutateAsync(selected)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Asignar sucursales</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72 pr-2">
          <div className="space-y-3">
            {branches.map((b: RestaurantBranch) => (
              <label key={b.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selected.includes(b.id)}
                  onChange={(e) => toggle(b.id, e.target.checked)}
                />
                <span>{b.address ?? b.name ?? `Sucursal #${b.id}`}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={onSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const BranchesModal = {
  open(params: OpenParams) {
    externalOpen?.(params)
  }
}



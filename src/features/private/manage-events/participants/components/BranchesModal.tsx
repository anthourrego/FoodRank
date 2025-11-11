import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import restaurantBranchService from "@/features/private/restaurant/services/RestaurantBranchService"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents"
import type { RestaurantBranch, RestaurantBranchesResponse } from "@/features/private/restaurant/types/restaurant-branch.types"
import type { EventProductBranch } from "@/models/interfaces"
import { setBranchesModalOpen } from "./BranchesModalUtils"
import { toast } from "sonner"

interface OpenParams {
  eventId: number
  restaurantId: number
  productId: number
  assignedBranches: EventProductBranch[]
}

export function BranchesModalInternal() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState<OpenParams | null>(null)
  const [selected, setSelected] = useState<number[]>([])

  const { useSaveBranchesForProductEventMutation } = useQueryServiceEvents()
  const saveMutation = useSaveBranchesForProductEventMutation(params?.eventId ?? 0, params?.productId ?? 0)
  const queryClient = useQueryClient()

  const { data: branchesResp } = useQuery<RestaurantBranchesResponse>({
    enabled: open && !!params?.restaurantId,
    queryKey: ["restaurant-branches", { restaurantId: params?.restaurantId }],
    queryFn: () => restaurantBranchService.getAll({ restaurant_id: params!.restaurantId, per_page: 200 }),
  })

  const branches = useMemo<RestaurantBranch[]>(() => branchesResp?.data ?? [], [branchesResp])

  useEffect(() => {
    setBranchesModalOpen((p: OpenParams) => {
      setParams(p)
      // Inicializar con las sucursales ya asignadas
      const assignedBranchIds = p.assignedBranches.map(bp => bp.restaurant_branch_id)
      setSelected(assignedBranchIds)
      setOpen(true)
    })
    return () => { setBranchesModalOpen(null) }
  }, [])

  function toggle(id: number, checked: boolean) {
    setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id))
  }

  async function onSave() {
    if (!params) return
    await saveMutation.mutateAsync(selected,{
      onSuccess:()=>{
        queryClient.invalidateQueries({ queryKey: ['products-by-event', params.eventId] })
        toast.success("Sucursales guardadas correctamente")
      },
      onError:(error)=>{
        const errorMessage = error?.message || "Error al guardar las sucursales";
        toast.error(errorMessage);
      }

    })
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
                <span>{b.address ?? `Sucursal #${b.id}`}</span>
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




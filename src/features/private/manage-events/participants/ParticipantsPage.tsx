import { useMemo } from "react"
import { useNavigate, useParams } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents"
import { DataTable } from "@/components/ui/data-table"
import type { EventsProduct } from "@/features/public/models/EventsProducts"
import { columns } from "./columns"
import { AssignForm } from "./components/AssignForm"
import { BranchesModalInternal } from "./components/BranchesModal.tsx"
import { BranchesModal } from "./components/BranchesModalUtils"
import { toast } from "sonner"

function ParticipantsPage() {
  const { eventId } = useParams()
  const id = Number(eventId)
  const { GetProductsByEvent, useRemoveProductFromEventMutation } = useQueryServiceEvents()
  const { data, isLoading } = GetProductsByEvent(id)
  const removeMutation = useRemoveProductFromEventMutation(id)
  const navigate = useNavigate()

  const rows = useMemo(() => Array.isArray(data?.data) ? data.data : [], [data])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Participantes del evento</h1>
          <Button variant="outline" onClick={() => navigate('/home/manage-events')}>
            Volver
          </Button>
        </div>


        <CardContent className="p-0">
          <AssignForm eventId={id} />
        </CardContent>


 
            <DataTable
              columns={columns(
                async (row: EventsProduct) => {
                  const productId = Number(row.product_id)
                  if (!productId) return
                  try {
                    await removeMutation.mutateAsync(productId, {
                      onSuccess: () => {
                        toast.success("Producto eliminado del evento correctamente");
                      },
                      onError: (error) => {
                        const errorMessage =  error?.message || "Error al eliminar el producto del evento";
                        toast.error(errorMessage);
                      }
                    });
                  } catch {
                    // Error ya manejado en onError
                  }
                },
                (row: EventsProduct) => {
                  BranchesModal.open({
                    eventId: row.id,
                    restaurantId: row.restaurant_product.restaurant.id,
                    productId: row.product_id,
                    assignedBranches: row.branchs_product || [],
                  })
                }
              )}
              data={isLoading ? [] : rows}
            />

        <BranchesModalInternal />
      </div>
    </div>
  )
}

export default ParticipantsPage



import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { productsRestaurantService } from "@/features/private/products-restaurant/services/ProductsRestaurantService"
import { useQuery } from "@tanstack/react-query"
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents"
import { toast } from "sonner"
import type { ProductRestaurantListResponse, ProductRestaurant } from "@/features/private/products-restaurant/types/products-restaurant.types"
import { FormCombobox } from "@/components/form/FormCombobox"

const schema = z.object({
  product_id: z.string().min(1, "Seleccione un producto"),
})

type FormData = z.infer<typeof schema>

interface Props {
  eventId: number
}

export function AssignForm({ eventId }: Props) {
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { product_id: "" } })
  const { useAddProductToEventMutation } = useQueryServiceEvents()
  const addMutation = useAddProductToEventMutation(eventId)



  const { data: productsResp } = useQuery<ProductRestaurantListResponse>({
    queryKey: ["products-restaurant", { page: 1 }],
    queryFn: () => productsRestaurantService.getProductsRestaurant({ page: 1, per_page: 100 }),
  })

  const productsOptions = useMemo(() => {
    console.log(productsResp?.data)
    const list = productsResp?.data
    return Array.isArray(list) ? list as ProductRestaurant[] : []
  }, [productsResp])

  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(values: FormData) {
    setSubmitting(true)
    try {
      await addMutation.mutateAsync(Number(values.product_id), {
        onSuccess: () => {
          toast.success("Producto asignado correctamente");
          form.reset({ product_id: "" });
        },
        onError: (error) => {
          const errorMessage = error?.message || "Error al asignar el producto";
          toast.error(errorMessage);
        }
      });
    } catch {
      // Error ya manejado en onError
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="p-4">
      <Form {...form}>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={form.handleSubmit(onSubmit)}>
          
          <FormCombobox
            control={form.control}
            required={true}
            label="Producto"
    
            items={productsOptions.map((p) => ({ label: p.name + " - " + p.restaurant.name, value: p.id }))}
            name="product_id"
            textUnselected="Seleccione un producto"
            className="w-full lg:w-full"
          />
          <div>
            <Button type="submit" disabled={submitting || addMutation.isPending} className="bg-red-800/80 hover:bg-red-800 text-white">
              {addMutation.isPending ? "Asignando..." : "Asignar"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}



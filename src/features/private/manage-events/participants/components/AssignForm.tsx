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
import { useNotification } from "@/features/private/restaurant/hook/UseNotification"
import { toast } from "sonner"

const schema = z.object({
  product_id: z.string().min(1, "Seleccione un producto"),
})

type FormData = z.infer<typeof schema>

interface Props {
  eventId: number
}

export function AssignForm({ eventId }: Props) {
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { product_id: "" } })
  const { addProductToEventMutation } = useQueryServiceEvents()
  const addMutation = addProductToEventMutation(eventId)



  const { data: productsResp } = useQuery({
    queryKey: ["products-restaurant", { page: 1 }],
    queryFn: () => productsRestaurantService.getProductsRestaurant({ page: 1, per_page: 100 }),
  })

  const productsOptions = useMemo(() => {
    const list = Array.isArray(productsResp?.data) ? productsResp?.data : productsResp?.data?.data
    return Array.isArray(list) ? list : []
  }, [productsResp])

  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(values: FormData) {
    setSubmitting(true)
    try {
      await addMutation.mutateAsync(Number(values.product_id),{
        onSuccess:()=>{
          toast.success("Producto asignado correctamente")
        },
        onError:(error)=>{
          console.error(error)
          toast.error(error.message || "Error al asignar el producto")
        }
      })
      form.reset({ product_id: "" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="p-4">
      <Form {...form}>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productsOptions?.map((p: any) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" disabled={submitting || addMutation.isPending}>
              {addMutation.isPending ? "Asignando..." : "Asignar"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}



"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Trophy, Medal, Award, Star, Crown, ArrowLeft, Sparkles, BarChart3, Table2, Download } from "lucide-react"
import { useNavigate } from "react-router"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useRanking } from "./hooks/useRanking"
import { useQueryServiceEvents } from "@/hooks/useQueryServiceEvents"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RankingItem, EventSummary, ReviewItem } from "./types/ranking.types"
import { DataTableServer } from "@/components/ui/data-table-server"
import type { ColumnDef } from "@tanstack/react-table"

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      )
    case 2:
      return (
        <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Medal className="w-7 h-7 text-white" />
        </div>
      )
    case 3:
      return (
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Award className="w-7 h-7 text-white" />
        </div>
      )
    default:
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md border border-gray-300">
          <span className="text-gray-700 font-bold text-lg">{position}</span>
        </div>
      )
  }
}

const getRankBadge = (position: number) => {
  switch (position) {
    case 1:
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold px-4 py-2 rounded-full shadow-lg">
          🥇 CAMPEÓN
        </Badge>
      )
    case 2:
      return (
        <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 hover:from-gray-400 hover:to-gray-600 text-white font-bold px-4 py-2 rounded-full shadow-lg">
          🥈 SUBCAMPEÓN
        </Badge>
      )
    case 3:
      return (
        <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold px-4 py-2 rounded-full shadow-lg">
          🥉 TERCER LUGAR
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="font-bold px-3 py-1 rounded-full border-2">
          #{position}
        </Badge>
      )
  }
}

 function Ranking() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTableModalOpen, setIsTableModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<RankingItem | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const navigate = useNavigate()

  const { ranking, paginatedRanking, isLoadingExport, getRanking, getRankingPaginated, exportToExcel } = useRanking()
  const { GetEvents } = useQueryServiceEvents()
  const { data: eventsData } = GetEvents()

  const selectedEventName = eventsData?.data?.find((event: EventSummary) => event.id === selectedEventId)?.name || 'evento'

  useEffect(() => {
    if (!selectedEventId && eventsData?.data?.length > 0) {
      setSelectedEventId(eventsData.data[0].id)
    }
  }, [eventsData, selectedEventId])

  useEffect(() => {
    if (selectedEventId) {
      getRanking(selectedEventId)
    }
  }, [selectedEventId, getRanking])

  useEffect(() => {
    if (selectedEventId && isTableModalOpen) {
      getRankingPaginated(selectedEventId, currentPage, perPage)
    }
  }, [selectedEventId, isTableModalOpen, currentPage, perPage, getRankingPaginated])

  const handleProductClick = (product: RankingItem) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleOpenTableModal = () => {
    setIsTableModalOpen(true)
    setCurrentPage(1)
  }

  const handleCloseTableModal = () => {
    setIsTableModalOpen(false)
    setCurrentPage(1)
  }

  const handleExportToExcel = async () => {
    if (selectedEventId) {
      try {
        await exportToExcel(selectedEventId, selectedEventName)
      } catch (error) {
        console.error('Error al exportar:', error)
      }
    }
  }

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setCurrentPage(pageIndex + 1) // TanStack usa índice base 0, Laravel base 1
    setPerPage(pageSize)
  }

  //columnas para la tabla
  const columns: ColumnDef<ReviewItem>[] = [
    {
      accessorKey: "restaurant_name",
      header: "Restaurante",
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.restaurant_name}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "product_name",
      header: "Producto",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">{row.original.product_name}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "rating",
      header: () => <div className="text-center">Calificación</div>,
      cell: ({ row }) => (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= row.original.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-lg text-gray-900">{row.original.rating}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "comment",
      header: "Comentario",
      cell: ({ row }) => (
        <div className="min-w-[300px] max-w-[400px]">
          <p className="text-sm text-gray-700 line-clamp-3 break-words whitespace-normal" title={row.original.comment || 'Sin comentario'}>
            {row.original.comment || <span className="text-gray-400 italic">Sin comentario</span>}
          </p>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "ip",
      header: () => <div className="text-center">IP</div>,
      cell: ({ row }) => (
        <span className="text-xs text-gray-500">{row.original.ip}</span>
      ),
      enableSorting: false,
    },
  ]

/*   if(ranking.length === 0) {
    return <div>Sin datos disponibles para el evento seleccionado</div>
  }
 */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Crown className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Ranking del Evento
            </h1>
            <div className="relative">
              <Crown className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-1 -left-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre cuáles son los mejores calificadas por nuestros usuarios en el evento seleccionado
          </p>

          <div className="mt-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="w-full md:w-80">
                <Select value={selectedEventId?.toString() || ""} onValueChange={(value) => setSelectedEventId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventsData?.data?.map((event: EventSummary) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
             {/*  <Button
              onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-full px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al listado
              </Button> */}

{selectedEventId && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
                <Button
                  onClick={handleOpenTableModal}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-full px-6 py-3"
                >
                  <Table2 className="w-4 h-4" />
                  Ver tabla
                </Button>

                <Button
                  onClick={handleExportToExcel}
                  disabled={isLoadingExport}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 shadow-lg transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  {isLoadingExport ? 'Exportando...' : 'Exportar a Excel'}
                </Button>
              </div>
            )}
            </div>

            
          </div>
        </div>

        {ranking.length > 0 ? (
<><div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🏆 Podium de Ganadores</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end  space-y-8 md:space-y-0">
            
            <div className="order-2 md:order-1 flex flex-col items-center">
              <div className="relative group w-full max-w-sm">
                <Card 
                  className="overflow-visible shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 transform hover:scale-105 transition-all duration-500 rounded-3xl h-[480px] flex flex-col cursor-pointer"
                  onClick={() => handleProductClick(ranking[1])}
                >
                  
                  <div className="flex justify-center pt-6 pb-2">
                    <div className="bg-gradient-to-r from-gray-300 to-gray-500 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-xl border-4 border-white">
                      #2
                    </div>
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="aspect-video relative overflow-hidden rounded-3xl mx-4">
                      <LazyLoadImage
                       src={
                        import.meta.env.VITE_URL_BACK +
                        "imageproduct/" +
                        ranking[1]?.product_image
                      }
                      alt={ranking[1]?.product_name}
                     
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                    </div>
                  </div>

                  <CardContent className="p-6 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-1 text-gray-900 line-clamp-2 min-h-[3.5rem]">
                        {ranking[1]?.product_name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= (ranking[1]?.avg_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="font-bold text-xl text-gray-900 ml-2">{ranking[1]?.avg_rating}</span>
                        
                      </div>
                      <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {ranking[1]?.total_reviews} votos
                              </span>
                    </div>
                    <Badge className="bg-gradient-to-r w-full from-gray-300 to-gray-500 hover:from-gray-400 hover:to-gray-600 text-white px-4 py-2 rounded-full">
                      🥈 SUBCAMPEÓN
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            
            <div className="order-1 md:order-2 flex flex-col items-center">
              <div className="relative group w-full max-w-sm">
                <Card 
                  className="overflow-visible shadow-2xl border-0 bg-gradient-to-br from-yellow-50 to-white transform hover:scale-105 transition-all duration-500 rounded-3xl ring-4 ring-yellow-400/30 h-[560px] flex flex-col cursor-pointer"
                  onClick={() => handleProductClick(ranking[0])}
                >
                  
                  <div className="flex flex-col items-center pt-4 pb-2">
                    <div className="relative mb-2">
                      <Crown className="w-16 h-16 text-yellow-500" />
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-xl border-4 border-white">
                      #1
                    </div>
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="aspect-video relative overflow-hidden rounded-3xl mx-4">
                      <LazyLoadImage
                        src={
                          import.meta.env.VITE_URL_BACK +
                          "imageproduct/" +
                          ranking[0]?.product_image
                        }
                        alt={ranking[0]?.product_name}
                     
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                   
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/20 to-transparent rounded-3xl"></div>
                    </div>
                  </div>

                  <CardContent className="p-6 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-2xl mb-1 text-gray-900 line-clamp-2 min-h-[3.0rem]">
                        {ranking[0]?.product_name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= (ranking[0]?.avg_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="font-bold text-2xl text-gray-900 ml-2">{ranking[0]?.avg_rating}</span>
                      </div>
                      <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {ranking[0]?.total_reviews} votos
                              </span>
                    </div>
                    <Badge className="bg-gradient-to-r w-full from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-lg px-6 py-3 rounded-full shadow-lg">
                      🥇 CAMPEÓN
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            
            <div className="order-3 md:order-3 flex flex-col items-center">
              <div className="relative group w-full max-w-sm">
                <Card 
                  className="overflow-visible shadow-2xl border-0 bg-gradient-to-br from-white to-amber-50 transform hover:scale-105 transition-all duration-500 rounded-3xl h-[480px] flex flex-col cursor-pointer"
                  onClick={() => handleProductClick(ranking[2])}
                >
                  
                  <div className="flex justify-center pt-6 pb-2">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-xl border-4 border-white">
                      #3
                    </div>
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="aspect-video relative overflow-hidden rounded-3xl mx-4">
                      <LazyLoadImage
                        src={
                          import.meta.env.VITE_URL_BACK +
                          "imageproduct/" +
                          ranking[2]?.product_image
                        }
                        alt={ranking[2]?.product_name}
                       
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                    </div>
                  </div>

                  <CardContent className="p-6 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-1 text-gray-900 line-clamp-2 min-h-[3.5rem]">
                        {ranking[2]?.product_name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= (ranking[2]?.avg_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="font-bold text-xl text-gray-900 ml-2">{ranking[2]?.avg_rating}</span>
                      </div>
                      <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {ranking[2]?.total_reviews} votos
                              </span>
                    </div>
                    <Badge className="bg-gradient-to-r w-full from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded-full">
                      🥉 TERCER LUGAR
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">📊 Ranking top 10</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto"></div>
          </div>

          <div className="space-y-6 grid grid-cols-1 md:grid-cols-2  gap-6">
            {ranking.slice(3).map((burger, index) => {
              const position = 4 + index
              

              return (
                <Card
                  key={burger.product_name}
                  className={`overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-0 rounded-2xl cursor-pointer ${
                    position <= 3 ? "ring-2 ring-offset-2" : ""
                  } ${
                    position === 1
                      ? "ring-yellow-400 bg-gradient-to-r from-yellow-50 to-white"
                      : position === 2
                        ? "ring-gray-300 bg-gradient-to-r from-gray-50 to-white"
                        : position === 3
                          ? "ring-amber-400 bg-gradient-to-r from-amber-50 to-white"
                          : "bg-white shadow-lg"
                  }`}
                  onClick={() => handleProductClick(burger)}
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row  items-center gap-4 md:gap-8">
                      
                      <div className="flex-shrink-0">{getRankIcon(position)}</div>

                      
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 relative overflow-hidden rounded-2xl shadow-lg group">
                          <LazyLoadImage
                            src={ import.meta.env.VITE_URL_BACK +
                              "imageproduct/" +burger.product_image || "/placeholder.svg"}
                            alt={burger.product_name}
                           
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        
                        </div>
                      </div>

                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{burger.product_name}</h3>
                            <p className="text-lg text-gray-600 mb-3">{burger.restaurant_name}</p>

                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= burger.avg_rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-bold text-xl text-gray-900">{burger.avg_rating}</span>
                            </div>
                              <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {burger.total_reviews} votos
                              </span>

                           
                          </div>

                          <div className="hidden md:flex flex-col items-end gap-3">
                            {getRankBadge(position)}

                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
</>
        )
        : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay datos disponibles para el evento seleccionado</p>
          </div>
        )}
        
      </div>

      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Detalles de votación - ${selectedProduct?.product_name || ''}`}
      >
        {selectedProduct?.detail ? (
          <div className="space-y-6">
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative overflow-hidden rounded-xl shadow-lg">
                <LazyLoadImage
                  src={import.meta.env.VITE_URL_BACK + "imageproduct/" + selectedProduct?.product_image}
                  alt={selectedProduct?.product_name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct?.product_name}</h3>
              <p className="text-gray-600 mb-4">{selectedProduct?.restaurant_name}</p>
              
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= (selectedProduct?.avg_rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="font-bold text-2xl text-gray-900 ml-2">{selectedProduct?.avg_rating}</span>
              </div>
            </div>

            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-500" />
                Distribución de votos
              </h4>
              <div className="space-y-3">
                {Object.entries(selectedProduct.detail).map(([stars, votes]: [string, number]) => (
                  <div key={stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-600">{stars}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(votes / selectedProduct?.total_reviews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {votes} votos
                    </span>
                  </div>
                ))}
              </div>
              
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total de votos:</span>
                  <span className="font-bold text-xl text-gray-900">{selectedProduct?.total_reviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total de comentarios:</span>
                  <span className="font-bold text-xl text-gray-900">{selectedProduct?.total_comments}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button onClick={() => navigate(`/home/ranking/product-event/${selectedProduct?.event_product_id}`)} variant="default">
                  Ver más
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay detalles de votación disponibles</p>
          </div>
        )}
      </Modal>

      {/* Modal de Tabla */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={handleCloseTableModal}
        title={`Ranking Completo - ${selectedEventName}`}
        className="!max-w-7xl"
      >
        <div className="space-y-6">
          <DataTableServer
            columns={columns}
            data={paginatedRanking.data}
            pageCount={paginatedRanking.last_page}
            pageIndex={currentPage - 1} // TanStack usa índice base 0
            pageSize={perPage}
            total={paginatedRanking.total}
            from={paginatedRanking.from}
            to={paginatedRanking.to}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Ranking
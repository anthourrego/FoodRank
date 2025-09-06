import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, User, MessageSquare } from "lucide-react"

interface Comment {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

interface RatingCommentsProps {
  comments: Comment[]
  showAll?: boolean
}

export function RatingComments({ comments }: RatingCommentsProps) {
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return "bg-green-100 text-green-800 border-green-200"
    if (rating >= 4) return "bg-blue-100 text-blue-800 border-blue-200"
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (rating >= 2) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No hay comentarios aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {comments.map((comment) => (
        <Card key={comment.id} className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  
                  <p className="font-medium text-sm text-gray-900">{formatDate(comment.date)}</p>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`${getRatingColor(comment.rating)} flex items-center gap-1 px-2 py-1`}
              >
                <Star className="w-3 h-3 fill-current" />
                {comment.rating}
              </Badge>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{comment.comment}</p>
          </CardContent>
        </Card>
      ))}

     
    </div>
  )
}

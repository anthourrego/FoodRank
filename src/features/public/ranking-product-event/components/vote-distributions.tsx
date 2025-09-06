
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

interface VoteBreakdown {
  1: number
  2: number
  3: number
  4: number
  5: number
}

interface VoteDistributionProps {
  voteBreakdown: VoteBreakdown
  totalVotes: number
}

export function VoteDistribution({ voteBreakdown, totalVotes }: VoteDistributionProps) {
  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0
  }

  return (
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((rating) => {
        const votes = voteBreakdown[rating as keyof VoteBreakdown]
        const percentage = getPercentage(votes)

        return (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm font-medium">{rating}</span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>

            <div className="flex-1">
              <Progress
                value={percentage}
                className="h-2"
                style={{
                  background: "#f1f5f9",
                }}
              />
            </div>

            <div className="flex items-center gap-2 w-16 text-right">
              <span className="text-sm text-gray-600">{votes}</span>
              <span className="text-xs text-gray-500">({percentage.toFixed(0)}%)</span>
            </div>
          </div>
        )
      })}

      <div className="pt-2 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total de votos:</span>
          <span className="font-medium text-gray-900">{totalVotes}</span>
        </div>
      </div>
    </div>
  )
}

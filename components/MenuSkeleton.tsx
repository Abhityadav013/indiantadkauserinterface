import { Skeleton } from "@mui/material"

export default function MenuSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-8/12">
          {/* Search Bar Skeleton */}
          <Skeleton variant="rectangular" height={56} className="mb-6 rounded-full" />

          {/* Category Filter Skeleton */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={32} className="rounded-full" />
              ))}
          </div>

          {/* Menu Items Skeleton */}
          {Array(3)
            .fill(0)
            .map((_, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <Skeleton variant="text" width={200} height={40} className="mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, itemIndex) => (
                      <div key={itemIndex} className="flex border rounded-lg overflow-hidden">
                        <Skeleton variant="rectangular" width={120} height={120} />
                        <div className="flex-1 p-4">
                          <div className="flex justify-between mb-2">
                            <Skeleton variant="text" width={120} />
                            <Skeleton variant="text" width={60} />
                          </div>
                          {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} variant="text" />
                          ))}
                          <div className="flex justify-between mt-4">
                            <Skeleton variant="rectangular" width={100} height={36} className="rounded" />
                            <Skeleton variant="rectangular" width={60} height={36} className="rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div className="hidden md:block md:w-4/12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Skeleton variant="text" width={120} height={32} className="mb-4" />
            <div className="space-y-4 mb-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <Skeleton variant="text" width={150} />
                      <Skeleton variant="text" width={60} />
                    </div>
                    <div className="flex items-center">
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width={20} className="mx-2" />
                      <Skeleton variant="circular" width={24} height={24} />
                    </div>
                  </div>
                ))}
            </div>
            <Skeleton variant="rectangular" height={50} className="mt-6 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

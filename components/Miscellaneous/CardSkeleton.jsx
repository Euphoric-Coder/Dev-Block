import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 space-y-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Cover image placeholder */}
      <div className="relative h-48 w-full overflow-hidden rounded-2xl">
        <Skeleton className="h-full w-full bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
      </div>

      <div className="space-y-4">
        {/* Category badge placeholder */}
        <Skeleton className="h-6 w-24 rounded-full bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />

        {/* Title placeholder */}
        <Skeleton className="h-7 w-11/12 rounded-lg bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />

        {/* Description placeholder */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
          <Skeleton className="h-4 w-full rounded bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
          <Skeleton className="h-4 w-2/3 rounded bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>

        {/* Tags placeholder */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
          <Skeleton className="h-6 w-20 rounded-full bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200/60 dark:bg-slate-800/40 my-1" />

        {/* Footer details placeholder */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
            <Skeleton className="h-4 w-24 rounded bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
          </div>
          <Skeleton className="h-4 w-12 rounded bg-gray-200/60 dark:bg-slate-800/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;

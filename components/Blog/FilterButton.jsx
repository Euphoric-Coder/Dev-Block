import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"; // Assuming you're using shadcn
import { cn } from "@/lib/utils";

const FilterButton = ({
  tempFilters,
  setTempFilters,
  blogCategories,
  blogSubCategoriesList,
  blogAuthors,
  filterCount,
  selectedCategoryCount,
  selectedSubCategoryCount,
  selectedAuthorCount,
  hasActiveFilters,
  applyFilters,
  clearFilters,
  resetFilters,
  handleDialogClose,
}) => {
  return (
    <div className="flex gap-3">
      <Dialog
        onOpenChange={handleDialogClose}
        onClose={() => setIsFilterOpen(false)}
      >
        <DialogTrigger asChild>
          <Button
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm",
              filterCount > 0
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/10"
                : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Filter size={14} className="mr-0.5" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white dark:bg-slate-900 text-[10px] font-black text-blue-600 dark:text-teal-400 border border-blue-100 dark:border-slate-800/80 shadow-sm ml-0.5 animate-pulse">
                {filterCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] w-[95%] max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin z-50">
          {/* Background Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Filter Heading */}
          <DialogHeader className="relative z-10 mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider shadow-sm w-fit mb-2">
              Filter Options
            </span>
            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              Blog Filters
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Apply criteria below to refine the list of published posts.
            </DialogDescription>
          </DialogHeader>

          {/* Filter Options */}
          <div className="space-y-6 relative z-10">
            {/* Sort Blogs By */}
            <div className="relative p-5 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">
                    Sort Blogs By
                  </label>
                  <Badge className="border-0 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {tempFilters.oldestBlog ? "Oldest First" : "Newest First"}
                  </Badge>
                </div>

                {tempFilters.oldestBlog && (
                  <button
                    onClick={() =>
                      setTempFilters((prev) => ({
                        ...prev,
                        oldestBlog: false,
                      }))
                    }
                    className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 px-2.5 py-1 rounded-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  onClick={() =>
                    setTempFilters((prev) => ({
                      ...prev,
                      oldestBlog: true,
                    }))
                  }
                  className={`border rounded-full text-xs font-semibold cursor-pointer px-3 py-1.5 transition-all duration-200 shadow-sm ${
                    tempFilters.oldestBlog
                      ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/10"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-850"
                  }`}
                >
                  Oldest First
                </Badge>
                <Badge
                  onClick={() =>
                    setTempFilters((prev) => ({
                      ...prev,
                      oldestBlog: false,
                    }))
                  }
                  className={`border rounded-full text-xs font-semibold cursor-pointer px-3 py-1.5 transition-all duration-200 shadow-sm ${
                    !tempFilters.oldestBlog
                      ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/10"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-850"
                  }`}
                >
                  Newest First
                </Badge>
              </div>
            </div>

            {/* Date Range */}
            <div className="relative p-5 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-300 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">
                Blog Creation Date Range
              </label>
              <div>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full px-5 py-5 rounded-2xl text-xs border font-semibold justify-start text-left shadow-sm bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:ring-teal-500/10 dark:focus:border-teal-500",
                        !tempFilters.dateRange.from && "text-slate-405"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2 text-slate-400" />
                      {tempFilters.dateRange.from ? (
                        tempFilters.dateRange.to ? (
                          <>
                            {format(
                              new Date(tempFilters.dateRange.from),
                              "LLL dd, y"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(tempFilters.dateRange.to),
                              "LLL dd, y"
                            )}
                          </>
                        ) : (
                          format(
                            new Date(tempFilters.dateRange.from),
                            "LLL dd, y"
                          )
                        )
                      ) : (
                        <span>Pick a Date Range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-xl mt-2" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={
                        tempFilters.dateRange.from
                          ? new Date(tempFilters.dateRange.from)
                          : new Date()
                      }
                      selected={{
                        from: tempFilters.dateRange.from
                          ? new Date(tempFilters.dateRange.from)
                          : undefined,
                        to: tempFilters.dateRange.to
                          ? new Date(tempFilters.dateRange.to)
                          : undefined,
                      }}
                      onSelect={(e) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            from: e?.from ? format(e.from, "yyyy-MM-dd") : "",
                            to: e?.to ? format(e.to, "yyyy-MM-dd") : "",
                          },
                        }))
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Categories */}
            <div className="relative p-5 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-300 max-h-[300px] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">
                    Categories ({blogCategories.length})
                  </label>
                  {/* Show Selected Count Badge */}
                  {selectedCategoryCount > 0 && (
                    <Badge className="border-0 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Selected: {selectedCategoryCount}
                    </Badge>
                  )}
                </div>
                <div>
                  {/* Clear Button */}
                  {selectedCategoryCount > 0 && (
                    <button
                      onClick={() =>
                        setTempFilters({
                          ...tempFilters,
                          category: [],
                        })
                      }
                      className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 px-2.5 py-1 rounded-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 transition-all"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {blogCategories.map((category) => (
                  <Badge
                    key={category}
                    onClick={() => {
                      setTempFilters((prev) => ({
                        ...prev,
                        category: prev.category.includes(category.toLowerCase())
                          ? prev.category.filter(
                              (c) => c !== category.toLowerCase()
                            )
                          : [...prev.category, category.toLowerCase()],
                      }));
                    }}
                    className={`border rounded-full text-xs font-semibold cursor-pointer px-3 py-1.5 transition-all duration-200 shadow-sm ${
                      tempFilters.category.includes(category.toLowerCase())
                        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/10"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-850"
                    }`}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sub-Categories (Only Show When Categories Are Selected) */}
            {tempFilters.category.length > 0 && (
              <div className="relative p-5 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-300 max-h-[220px] overflow-y-auto scrollbar-thin">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-355">
                      Sub-Categories (
                      {
                        new Set(
                          tempFilters.category.flatMap(
                            (category) => blogSubCategoriesList[category] || []
                          )
                        ).size
                      }
                      )
                    </label>
                    {/* Show Selected Count Badge */}
                    {selectedSubCategoryCount > 0 && (
                      <Badge className="border-0 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Selected: {selectedSubCategoryCount}
                      </Badge>
                    )}
                  </div>
                  <div>
                    {/* Clear Button */}
                    {selectedSubCategoryCount > 0 && (
                      <button
                        onClick={() =>
                          setTempFilters({
                            ...tempFilters,
                            subCategories: [],
                          })
                        }
                        className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 px-2.5 py-1 rounded-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 transition-all"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories List */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    ...new Set(
                      tempFilters.category.flatMap(
                        (category) => blogSubCategoriesList[category] || []
                      )
                    ),
                  ] // Convert Set back to an array to prevent duplicates
                    .map((subCategory) => (
                      <Badge
                        key={subCategory}
                        onClick={() => {
                          setTempFilters((prev) => ({
                            ...prev,
                            subCategories: prev.subCategories.includes(
                              subCategory.toLowerCase()
                            )
                              ? prev.subCategories.filter(
                                  (c) => c !== subCategory.toLowerCase()
                                )
                              : [
                                  ...prev.subCategories,
                                  subCategory.toLowerCase(),
                                ],
                          }));
                        }}
                        className={`border rounded-full text-xs font-semibold cursor-pointer px-3 py-1.5 transition-all duration-205 shadow-sm ${
                          tempFilters.subCategories.includes(
                            subCategory.toLowerCase()
                          )
                            ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/10"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-850"
                        }`}
                      >
                        {subCategory}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Authors */}
            <div className="relative p-5 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-300 max-h-[300px] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">
                    Authors ({blogAuthors.length})
                  </label>
                  {/* Show Selected Count Badge */}
                  {selectedAuthorCount > 0 && (
                    <Badge className="border-0 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Selected: {selectedAuthorCount}
                    </Badge>
                  )}
                </div>
                <div>
                  {/* Clear Button */}
                  {selectedAuthorCount > 0 && (
                    <button
                      onClick={() =>
                        setTempFilters({
                          ...tempFilters,
                          authors: [],
                        })
                      }
                      className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 px-2.5 py-1 rounded-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 transition-all"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {blogAuthors.map((author) => (
                  <Badge
                    key={author}
                    onClick={() => {
                      setTempFilters((prev) => ({
                        ...prev,
                        authors: prev.authors.includes(author.toLowerCase())
                          ? prev.authors.filter(
                              (c) => c !== author.toLowerCase()
                            )
                          : [...prev.category, author.toLowerCase()],
                      }));
                    }}
                    className={`border rounded-full text-xs font-semibold cursor-pointer px-3 py-1.5 transition-all duration-200 shadow-sm ${
                      tempFilters.authors.includes(author.toLowerCase())
                        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/10"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-355 dark:border-slate-800 dark:hover:bg-slate-850"
                    }`}
                  >
                    {author}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
              >
                Clear Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  Reset Filters
                </button>
              )}
              <DialogClose asChild>
                <button
                  onClick={applyFilters}
                  className="px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-blue-500 hover:bg-blue-600 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/10"
                >
                  Apply Filters
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FilterButton;

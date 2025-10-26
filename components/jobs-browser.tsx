"use client"

import { useState, useMemo } from "react"
import type { Job } from "@/lib/types"
import { JobCard } from "@/components/job-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JobsBrowserProps {
  jobs: Job[]
}

export function JobsBrowser({ jobs }: JobsBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Get unique values for filters
  const departments = useMemo(() => Array.from(new Set(jobs.map((job) => job.department))), [jobs])
  const types = useMemo(() => Array.from(new Set(jobs.map((job) => job.type))), [jobs])
  const locations = useMemo(() => Array.from(new Set(jobs.map((job) => job.location))), [jobs])

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
      const matchesType = typeFilter === "all" || job.type === typeFilter
      const matchesLocation = locationFilter === "all" || job.location === locationFilter

      return matchesSearch && matchesDepartment && matchesType && matchesLocation
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
        case "date-asc":
          return new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return filtered
  }, [jobs, searchQuery, departmentFilter, typeFilter, locationFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-5 w-5" style={{ color: "#C89333" }} />
          <h2 className="text-lg font-semibold" style={{ color: "#1A0D66" }}>
            Search & Filter
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, department, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={departmentFilter}
            onValueChange={(value) => {
              setDepartmentFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={locationFilter}
            onValueChange={(value) => {
              setLocationFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {paginatedJobs.length} of {filteredAndSortedJobs.length} jobs
        </div>
      </div>

      {/* Jobs Grid */}
      {paginatedJobs.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setDepartmentFilter("all")
              setTypeFilter("all")
              setLocationFilter("all")
              setCurrentPage(1)
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

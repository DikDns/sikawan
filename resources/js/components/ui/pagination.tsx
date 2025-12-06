import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

type PagerProps = {
  page: number
  pageCount: number
  onChange?: (page: number) => void
}

export function Pager({ page, pageCount, onChange }: PagerProps) {
  const goTo = (p: number) => {
    const clamped = Math.max(1, Math.min(pageCount, p))
    onChange?.(clamped)
  }

  const items: Array<number | 'ellipsis'> = []
  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) items.push(i)
  } else {
    items.push(1)
    if (page > 3) items.push('ellipsis')
    const start = Math.max(2, page - 1)
    const end = Math.min(pageCount - 1, page + 1)
    for (let i = start; i <= end; i++) items.push(i)
    if (page < pageCount - 2) items.push('ellipsis')
    items.push(pageCount)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={(e) => { e.preventDefault(); goTo(page - 1) }} href="#" />
        </PaginationItem>
        {items.map((it, idx) => (
          it === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={it}>
              <PaginationLink href="#" isActive={it === page} onClick={(e) => { e.preventDefault(); goTo(it as number) }}>
                {it}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        <PaginationItem>
          <PaginationNext onClick={(e) => { e.preventDefault(); goTo(page + 1) }} href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

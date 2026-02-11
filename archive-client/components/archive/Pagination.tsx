import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationDemo() {
  return (
    <div className="p-2 rounded-[2rem] bg-card/50 border border-white/10 backdrop-blur-md inline-block shadow-lg">
      <Pagination>
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="rounded-full border-white/20 hover:bg-primary/10 hover:border-primary/30 font-mono uppercase tracking-widest text-[10px]"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="rounded-full border-white/20 hover:bg-primary/10 hover:border-primary/30 font-mono w-10 h-10"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive
              className="rounded-full bg-primary text-primary-foreground dark:bg-blue-300 hover:bg-primary/90 font-mono w-10 h-10"
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="rounded-full border-white/20 hover:bg-primary/10 hover:border-primary/30 font-mono w-10 h-10"
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis className="text-muted-foreground" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              className="rounded-full border-white/20 hover:bg-primary/10 hover:border-primary/30 font-mono uppercase tracking-widest text-[10px]"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

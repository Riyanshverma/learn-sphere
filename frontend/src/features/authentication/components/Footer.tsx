export function Footer() {
  return (
    <footer className="py-6 w-full mx-auto">
      <div className="flex items-center justify-center gap-4 text-primary">
        <div className="h-[1.5px] flex-1 bg-linear-to-r from-transparent to-primary rounded-r-2xl" />
        <span className="font-heading text-xl tracking-tight shrink-0">Learn Sphere</span>
        <div className="h-[1.5px] flex-1 bg-linear-to-l from-transparent to-primary rounded-l-2xl" />
      </div>
    </footer>
  );
}

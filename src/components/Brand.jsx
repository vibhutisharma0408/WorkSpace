export default function Brand({ size = 'text-2xl' }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-6 w-6">
        <span className="absolute inset-0 rounded-md bg-primary/80 blur-[2px]" />
        <span className="absolute inset-0 rounded-md bg-primary" />
      </div>
      <span className={`${size} font-bold tracking-tight`}>TeamSpace</span>
    </div>
  )
}



export const AdminHome = () => {
  return (
    <div className="pt-28 pb-16 w-full font-sans space-y-6">
      <h1 className="text-4xl font-heading">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border bg-card/80">
          <h3 className="text-xl font-heading mb-2">Total Students</h3>
          <p className="text-3xl font-light text-primary">1,240</p>
        </div>
        <div className="p-6 rounded-3xl border bg-card/80">
          <h3 className="text-xl font-heading mb-2">Active Staff</h3>
          <p className="text-3xl font-light text-primary">85</p>
        </div>
        <div className="p-6 rounded-3xl border bg-card/80">
          <h3 className="text-xl font-heading mb-2">Pending Requests</h3>
          <p className="text-3xl font-light text-destructive">12</p>
        </div>
      </div>
    </div>
  )
}

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Enrollment & Setup",
      description: "Admin securely registers teachers, staff, and parents, instantly provisioning their customized portals."
    },
    {
      number: "02",
      title: "Daily Operations",
      description: "Teachers mark attendance and enter marks; Staff request leaves—all synced to the central database in real-time."
    },
    {
      number: "03",
      title: "Automated Insights",
      description: "Parents monitor progress via their dashboard while Admin oversees school-wide analytics effortlessly."
    }
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 relative z-10 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight">
            Seamless from <span className="text-primary italic">Start to Finish</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-border border-dashed border-t"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center text-3xl font-heading font-bold text-primary mb-8 shadow-lg shadow-primary/5">
                {step.number}
              </div>
              <h3 className="text-2xl font-heading font-medium mb-4">{step.title}</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

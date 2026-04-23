export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 relative z-10 bg-muted/20">
      <div className="container mx-auto max-w-7xl space-y-20">
        <div className="text-center">
          <h2 className="text-6xl font-heading font-normal">
            Seamless from <span className="text-primary">Start to Finish</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[3px] bg-muted"/>
          {([
            {
              number: "01",
              title: "Enrollment & Setup",
              description: "Admin securely registers teachers, staff, and parents, instantly provisioning their customized portals."
            },
            {
              number: "02",
              title: "Daily Operations",
              description: "Teachers mark attendance and enter marks; Staff request leaves—all synced to the central database."
            },
            {
              number: "03",
              title: "Automated Insights",
              description: "Parents monitor progress via their dashboard while Admin oversees school-wide analytics."
            }
          ] as const).map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border-2 border-primary flex items-center justify-center text-4xl font-heading font-normal text-primary mb-8">
                {step.number}
              </div>
              <h3 className="text-2xl font-heading font-normal mb-4">{step.title}</h3>
              <p className="text-muted-foreground font-sans leading-relaxed text-base font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

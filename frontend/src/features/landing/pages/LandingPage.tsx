import { Header, Hero, Problem, HowItWorks, Features, CTA, Footer } from ".."


export default function LandingPage() {

  return (
    // We apply the .dark class here to enforce the dark theme for the landing page
    <div className="dark min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="grow">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

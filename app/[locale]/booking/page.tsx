import { Navbar } from "@/components/navbar"
import { BookingCalendar } from "@/components/booking-calendar"
import { Footer } from "@/components/footer"

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Book a <span className="text-primary">Mentorship Session</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Choose your session type, pick a convenient time, and get ready to elevate your trading strategy.
          </p>
        </div>
        <BookingCalendar />
      </section>
      <Footer />
    </main>
  )
}

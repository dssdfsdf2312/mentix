import { Navbar } from "@/components/navbar"
import { CryptoPage } from "@/components/crypto-page"
import { Footer } from "@/components/footer"

export default function CryptoAdvicePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CryptoPage />
      <Footer />
    </main>
  )
}

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PRODUCTS } from "@/lib/products"
import { notFound } from "next/navigation"
import Checkout from "@/components/checkout"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ plan: string }>
}) {
  const { plan } = await params
  const product = PRODUCTS.find((p) => p.id === plan)

  if (!product) {
    notFound()
  }

  return (
    <main>
      <Navbar />
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl">
            Complete Your Purchase
          </h1>
          <p className="mb-8 text-center text-muted-foreground">
            {product.name} &mdash;{" "}
            <span className="font-bold text-primary">
              ${(product.priceInCents / 100).toFixed(0)}
            </span>
          </p>
          <Checkout productId={plan} />
        </div>
      </section>
      <Footer />
    </main>
  )
}

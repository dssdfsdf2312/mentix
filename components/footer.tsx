export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Mentix Trading. All rights reserved.
      </p>
    </footer>
  )
}

// Placeholder payment step. Swap this for a real integration (Stripe Elements,
// Stripe Checkout redirect, etc.) once you're ready to accept live payments.
// Keeping it isolated here means the rest of the checkout flow doesn't change
// when you wire in a provider.
export function Payment() {
  return (
    <div className="rounded-card border border-dashed border-line p-4 text-sm text-muted">
      Payment collection isn't wired up yet. Orders are created with{' '}
      <code className="rounded bg-line/60 px-1 py-0.5 text-xs">payment_status = 'unpaid'</code> so you can
      connect Stripe (or another processor) and update this status on successful payment.
    </div>
  )
}

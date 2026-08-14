import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <div className="px-4 py-5">
      <Helmet>
        <title>About — Store</title>
      </Helmet>
      <h1 className="mb-3 text-xl font-semibold">About us</h1>
      <p className="text-sm leading-relaxed text-ink/80">
        Replace this with your store's real story — what you sell, why it's different, and how to reach you.
        Edit this copy in <code className="rounded bg-line/60 px-1 py-0.5 text-xs">src/pages/About.tsx</code>.
      </p>
    </div>
  )
}

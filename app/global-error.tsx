"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <head>
        <title>Something went wrong</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f9fafb;
          }
          .container {
            text-align: center;
            padding: 2rem;
            max-width: 28rem;
          }
          h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 1rem;
          }
          p {
            color: #4b5563;
            margin-bottom: 2rem;
          }
          button {
            background-color: #0d9488;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-right: 0.5rem;
          }
          button:hover {
            background-color: #0f766e;
          }
          a {
            display: inline-block;
            color: #0d9488;
            text-decoration: none;
            margin-left: 0.5rem;
          }
          a:hover {
            text-decoration: underline;
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="container">
          <h1>Something went wrong</h1>
          <p>We apologize for the inconvenience. Please try again later.</p>
          <div>
            <button onClick={() => reset()}>Try again</button>
            <a href="/">Return to Home</a>
          </div>
        </div>
      </body>
    </html>
  )
}

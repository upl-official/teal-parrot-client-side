export default function NotFound() {
  return (
    <html>
      <head>
        <title>Page Not Found</title>
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
            font-size: 3.75rem;
            font-weight: 700;
            color: #0d9488;
            margin-bottom: 1rem;
          }
          h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          p {
            color: #4b5563;
            margin-bottom: 2rem;
          }
          a {
            display: inline-block;
            background-color: #0d9488;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          a:hover {
            background-color: #0f766e;
          }
        `,
          }}
        />
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>We couldn't find the page you were looking for. It might have been moved or doesn't exist.</p>
          <a href="/">Return to Home</a>
        </div>
      </body>
    </html>
  )
}

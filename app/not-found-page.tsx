export default function NotFoundPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3.75rem",
          fontWeight: "bold",
          color: "#0d9488",
          marginBottom: "1rem",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "semibold",
          marginBottom: "1rem",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          color: "#4b5563",
          marginBottom: "2rem",
          maxWidth: "28rem",
        }}
      >
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <a
        href="/"
        style={{
          backgroundColor: "#0d9488",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          textDecoration: "none",
          fontWeight: "medium",
          display: "inline-block",
        }}
      >
        Return to Home
      </a>
    </div>
  )
}

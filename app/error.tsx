"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "0 1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          color: "#dc2626",
          marginBottom: "1rem",
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          color: "#4b5563",
          marginBottom: "2rem",
          maxWidth: "28rem",
        }}
      >
        We apologize for the inconvenience. Please try again later.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0d9488",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #0d9488",
            color: "#0d9488",
            borderRadius: "0.375rem",
            textDecoration: "none",
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}

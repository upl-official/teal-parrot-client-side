const fs = require("fs")
const path = require("path")

// Check if .env.local exists, if not, copy .env.example to .env.local
const envLocalPath = path.join(process.cwd(), ".env.local")
const envExamplePath = path.join(process.cwd(), ".env.example")

if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
  console.log("Creating .env.local from .env.example...")
  fs.copyFileSync(envExamplePath, envLocalPath)
  console.log(".env.local created successfully!")
  console.log("Please review the values in .env.local and update them if needed.")
} else if (!fs.existsSync(envLocalPath)) {
  console.warn("Warning: .env.local file is missing. Please create it manually.")
  console.warn("You can use .env.example as a template.")
}

// Check for required dependencies
try {
  require("eslint")
} catch (error) {
  console.warn("Warning: eslint is not installed. This may cause build failures.")
  console.warn("Please run: pnpm add -D eslint")
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Update API Documentation</CardTitle>
        <CardDescription>Documentation for the user update API endpoint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Endpoint</h3>
          <p className="font-mono bg-muted p-2 rounded-md">PUT /api/v1/users/user/update</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Request Body</h3>
          <pre className="bg-muted p-2 rounded-md overflow-x-auto">
            {`{
  "userId": "string", // Required - The ID of the user to update
  "name": "string",   // Optional - The new name for the user
  "phone": "string"   // Optional - The new phone number for the user
}`}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Response</h3>
          <pre className="bg-muted p-2 rounded-md overflow-x-auto">
            {`{
  "success": true,
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
}`}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Error Codes</h3>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-semibold">400 Bad Request</span> - Invalid input data
            </li>
            <li>
              <span className="font-semibold">401 Unauthorized</span> - Missing or invalid authentication token
            </li>
            <li>
              <span className="font-semibold">404 Not Found</span> - User not found
            </li>
            <li>
              <span className="font-semibold">500 Internal Server Error</span> - Server-side error
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Notes</h3>
          <ul className="list-disc pl-5">
            <li>Email address cannot be updated through this endpoint</li>
            <li>At least one field (name or phone) must be provided for update</li>
            <li>Authentication token must be included in the Authorization header</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

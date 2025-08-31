import { createTestConfirmation } from '@/lib/debt-confirmations'
import { generateConfirmationLink } from '@/lib/debt-confirmations'

export default function TestPage() {
  const handleCreateTest = async () => {
    const token = await createTestConfirmation()
    if (token) {
      const link = generateConfirmationLink(token)
      console.log('Test confirmation link:', link)
      alert(`Test confirmation created! Link: ${link}`)
    } else {
      alert('Failed to create test confirmation')
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Confirmation System Test</h1>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test the Confirmation System</h2>
            <p className="text-gray-600 mb-4">
              Click the button below to create a test debt confirmation and get a shareable link.
            </p>
            <button
              onClick={handleCreateTest}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Test Confirmation
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How to Test:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Click "Create Test Confirmation" above</li>
              <li>Copy the generated link from the console/alert</li>
              <li>Open the link in a new browser window (or incognito)</li>
              <li>Test accepting and rejecting the debt</li>
              <li>Verify the status updates in the database</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Database Setup Required:</h2>
            <p className="text-gray-600 mb-4">
              Make sure you've run the database schema from <code>database_schema.sql</code> in your Supabase SQL Editor.
            </p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`-- Run this in Supabase SQL Editor
-- Copy from database_schema.sql`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

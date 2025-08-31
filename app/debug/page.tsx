'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase-client'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    try {
      // Test basic table access
      const { data: testData, error: testError } = await supabase
        .from('debt_confirmations')
        .select('count')
        .limit(1)

      // Check all confirmations
      const { data: allData, error: allError } = await supabase
        .from('debt_confirmations')
        .select('id, token, status, expires_at')
        .limit(10)

      setDebugInfo({
        basicAccess: { testData, testError },
        allConfirmations: { allData, allError }
      })
    } catch (error) {
      setDebugInfo({ error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Debug</h1>
      <Button onClick={runDebug} disabled={loading}>
        {loading ? 'Running...' : 'Run Debug'}
      </Button>

      {debugInfo && (
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  )
}

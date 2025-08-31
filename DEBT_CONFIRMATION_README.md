# Confiado - Debt Confirmation System

## Database Setup

Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create debt confirmations table
CREATE TABLE debt_confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_debt_confirmations_token ON debt_confirmations(token);
CREATE INDEX idx_debt_confirmations_debt_id ON debt_confirmations(debt_id);
CREATE INDEX idx_debt_confirmations_status ON debt_confirmations(status);

-- Enable Row Level Security
ALTER TABLE debt_confirmations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read confirmations (for public links)
CREATE POLICY "Anyone can read debt confirmations" ON debt_confirmations
  FOR SELECT USING (true);

-- Only authenticated users can create confirmations
CREATE POLICY "Authenticated users can create confirmations" ON debt_confirmations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only the creditor can update confirmations
CREATE POLICY "Creditors can update confirmations" ON debt_confirmations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM debts
      WHERE debts.id = debt_confirmations.debt_id
      AND debts.creditor_id = auth.uid()
    )
  );
```

## How It Works

1. **Creditor creates debt** → System generates unique confirmation token
2. **Unique link generated** → `/debt/confirm/[token]`
3. **Creditor shares link** → Via email, messaging, etc.
4. **Debtor clicks link** → Views debt details on secure page
5. **Debtor accepts/rejects** → Status updated in database
6. **Confirmation expires** → After 30 days automatically

## Features

- ✅ Secure token-based confirmation links
- ✅ 30-day expiration
- ✅ Public access (no login required for debtors)
- ✅ Professional confirmation page
- ✅ Accept/Reject functionality
- ✅ Status tracking
- ✅ Mobile-friendly

## Environment Variables

No additional environment variables needed! The system uses your existing Supabase configuration.

## Testing

1. Create a debt in your app
2. Copy the generated confirmation link
3. Open the link in a new browser/incognito window
4. Test accepting and rejecting the debt
5. Verify status updates in the database

## Testing the Confirmation System

1. **Visit the test page**: Go to `/test` in your browser
2. **Create a test confirmation**: Click "Create Test Confirmation"
3. **Copy the generated link**: From the alert or console
4. **Test the confirmation page**: Open the link in a new window
5. **Test responses**: Try accepting and rejecting the debt
6. **Verify database**: Check that statuses update correctly

## Troubleshooting

### Common Issues:

1. **"Invalid or expired confirmation link"**
   - Check that the database table exists
   - Verify the token is correct
   - Ensure the confirmation hasn't expired (30 days)

2. **"Failed to load confirmation details"**
   - Check Supabase connection
   - Verify foreign key relationships
   - Check browser console for errors

3. **Data not displaying correctly**
   - Check the database query structure
   - Verify profile relationships exist
   - Look at browser console for data structure

### Debug Mode:

The confirmation page includes debug information in development mode:
- Token value
- Current status
- Debt ID
- Amount and currency

## Database Verification:

Run these queries in Supabase SQL Editor to verify your setup:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('debts', 'debt_confirmations', 'profiles');

-- Check recent confirmations
SELECT * FROM debt_confirmations
ORDER BY created_at DESC
LIMIT 5;

-- Check debt relationships
SELECT dc.*, d.amount_minor, d.currency, d.due_date,
       cp.name as creditor_name, cp.email as creditor_email,
       dp.name as debtor_name, dp.email as debtor_email
FROM debt_confirmations dc
JOIN debts d ON dc.debt_id = d.id
LEFT JOIN profiles cp ON d.creditor_id = cp.id
LEFT JOIN profiles dp ON d.counterparty_id = dp.id
ORDER BY dc.created_at DESC
LIMIT 5;
```

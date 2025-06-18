
#!/bin/bash

echo "🔧 Setting up admin user creation..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --package-lock=false --save @supabase/supabase-js
fi

echo ""
echo "🔑 You need your Supabase Service Role Key to continue."
echo "📋 Get it from: https://supabase.com/dashboard/project/gidsrdkwacpchbswjdho/settings/api"
echo ""
read -p "Enter your SUPABASE_SERVICE_ROLE_KEY: " service_key

if [ -z "$service_key" ]; then
    echo "❌ Service key is required!"
    exit 1
fi

echo ""
echo "🚀 Creating admin user..."
SUPABASE_SERVICE_ROLE_KEY="$service_key" node create-admin-final.js

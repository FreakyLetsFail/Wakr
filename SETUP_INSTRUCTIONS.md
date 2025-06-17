# 🚀 Wakr Setup Instructions

## Database Migration to Supabase

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy the project URL and anon key

### 2. Setup Database Schema
1. In Supabase Dashboard → SQL Editor
2. Run the SQL script from `/lib/database/schema.sql`
3. This creates all tables with RLS policies

### 3. Environment Variables
Copy `.env.supabase.example` to `.env.local` and fill in:
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional - only for admin operations
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Note:** Service Role Key is only needed for:
- Admin operations that bypass Row Level Security
- Bulk data operations
- Server-side operations requiring full access

## Smart City Input Feature

### How it works:
1. **User enters city name** (e.g. "Dresden", "Berlin", "Munich")
2. **API validates city** using CountriesNow API
3. **Gets coordinates** from OpenStreetMap Nominatim
4. **Auto-detects timezone** based on country/coordinates
5. **Stores validated data** for weather integration

### APIs Used:
- **CountriesNow**: `https://countriesnow.space/api/v0.1/countries/cities`
- **Nominatim**: `https://nominatim.openstreetmap.org/search`
- **Timezone**: Automatic mapping for EU countries

### Example Flow:
```
User inputs: "Dresden" + "Germany"
↓
Validate against CountriesNow API
↓
Get coordinates: 51.0504, 13.7373
↓
Auto-detect timezone: "Europe/Berlin"
↓
Store: Dresden, Germany, DE, coordinates, timezone
```

## Testing

### Test Valid City:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com", 
    "password": "test123456",
    "phone": "01234567890",
    "phoneCountryCode": "+49",
    "residenceCountry": "DE",
    "hometown": "Dresden",
    "timezone": "Europe/Berlin"
  }'
```

### Test Invalid City:
```bash
# Returns error: "City not found in Germany"
curl -X POST ... -d '{"hometown": "InvalidCity123"}'
```

## Features Implemented

✅ **Supabase Integration**
- Client and server-side setup
- Database schema with RLS
- Environment configuration

✅ **Smart City Validation**
- Real-time city verification
- Coordinate fetching
- Timezone auto-detection
- Error handling for invalid cities

✅ **Enhanced Registration**
- City input field instead of timezone selector
- Automatic timezone detection
- Improved UX with validation feedback

## Next Steps

1. **Setup Supabase project** and run schema
2. **Configure environment variables**
3. **Test registration flow** with real cities
4. **Connect to weather APIs** using stored coordinates
5. **Implement user authentication** with Supabase Auth

## Benefits

🎯 **Better UX**: Users just type their city name
🌍 **Accurate Data**: Real cities with exact coordinates
⚡ **Auto-Detection**: Timezone automatically set
🛡️ **Validation**: Prevents invalid city data
🌤️ **Weather Ready**: Coordinates ready for weather APIs
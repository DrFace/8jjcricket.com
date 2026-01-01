# Cricket Archives API Integration

This document provides an overview of the Cricket Archives API integration implemented in this Next.js TypeScript project.

## 📁 Files Created

### 1. **Type Definitions** - `types/archive.ts`
Contains TypeScript interfaces for the Archives API:
- `Archive` - Single archive match data structure
- `ArchivesResponse` - Paginated API response structure
- `ArchiveFilters` - Filter parameters for API requests
- `PaginationLink` - Pagination link object structure

### 2. **Next.js API Route** - `app/api/archives/route.ts`
Next.js API route that proxies requests to the backend:
- Handles GET requests with query parameters
- Forwards requests to `BACKEND_ORIGIN/archives`
- Provides error handling and logging
- Returns JSON responses

### 3. **API Service** - `lib/api/archives.ts`
Service layer for interacting with the Next.js API route:
- `getArchives(filters?)` - Fetch archives with optional filters
- `getArchiveById(id)` - Fetch a single archive by ID (for future use)
- Built-in error handling and proper TypeScript typing
- Uses relative path `/api/archives` to call Next.js API route

### 4. **Custom Hook** - `hooks/useArchives.ts`
React hook for managing archive data fetching:
- Accepts optional filters as parameters
- Returns `{ data, loading, error, refetch }`
- Automatically re-fetches when filters change
- Handles loading and error states

### 4. **Archives Page** - `app/archive/page.tsx`
Complete archives listing page with:

**Features:**
- ✅ Category filter dropdown (All, International, Leagues)
- ✅ Format filter dropdown (All, T20, ODI, Test)
- ✅ Date picker for match date filtering
- ✅ Clear filters button
- ✅ Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- ✅ Archive cards with match details
- ✅ Smart pagination with page numbers
- ✅ Loading state with skeleton loaders
- ✅ Error state with retry option
- ✅ Empty state handling
- ✅ Sidebar with quick stats and active filters
- ✅ Scroll to top on page change

**Card Features:**
- Format and category badges (color-coded)
- Match title
- Round information
- Home and away teams with scores
- Match result
- Formatted match date with calendar icon
- Hover effects and smooth transitions

## 🚀 API Configuration

The API uses Next.js API routes to proxy requests to your backend.

### Architecture
```
Frontend (Browser)
    ↓
Next.js API Route (/api/archives)
    ↓
Backend API (https://api.8jjcricket.com/archives)
```

### Environment Variables
Configure in `.env.local`:
```env
BACKEND_ORIGIN=https://api.8jjcricket.com
```

### API Endpoint (Frontend)
```
GET /api/archives
```

This proxies to your backend at:
```
GET {BACKEND_ORIGIN}/archives
```

### Query Parameters
| Parameter | Type | Description | Values |
|-----------|------|-------------|--------|
| `date` | string | Filter by match date | YYYY-MM-DD format |
| `format` | string | Filter by format | T20, ODI, Test |
| `category` | string | Filter by category | International, Leagues |
| `per_page` | number | Items per page | Default: 30 |
| `page` | number | Page number | Default: 1 |

### Response Structure
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "sportmonks_fixture_id": 66710,
      "match_title": "Team A vs Team B",
      "format": "T20",
      "category": "International",
      "round": "Final",
      "home_team": "Team A",
      "away_team": "Team B",
      "home_score": "180/5",
      "away_score": "175/8",
      "status": "Finished",
      "result": "Team A won by 5 runs",
      "match_date": "2025-12-31T08:15:00.000000Z",
      "created_at": "2026-01-01T05:06:20.000000Z",
      "updated_at": "2026-01-01T05:06:20.000000Z"
    }
  ],
  "first_page_url": "...",
  "from": 1,
  "last_page": 10,
  "last_page_url": "...",
  "links": [...],
  "next_page_url": "...",
  "path": "...",
  "per_page": 30,
  "prev_page_url": null,
  "to": 30,
  "total": 300
}
```

## 🎨 Design System

### Color Coding
- **Format Badges:**
  - T20: Purple (`bg-purple-500/20`, `text-purple-300`)
  - ODI: Blue (`bg-blue-500/20`, `text-blue-300`)
  - Test: Green (`bg-green-500/20`, `text-green-300`)

- **Category Badges:**
  - International: Amber (`bg-amber-500/20`, `text-amber-300`)
  - Leagues: Sky Blue (`bg-sky-500/20`, `text-sky-300`)

### Layout
- **Mobile:** Single column grid
- **Tablet (sm):** 2 columns
- **Desktop (lg):** 3 columns + sidebar

### Accessibility
- Proper ARIA labels on pagination buttons
- Focus states on interactive elements
- Keyboard navigation support
- Semantic HTML structure

## 📖 Usage Examples

### Basic Usage
```typescript
import { useArchives } from '@/hooks/useArchives';

function MyComponent() {
  const { data, loading, error } = useArchives();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.data.map(archive => (
        <div key={archive.id}>{archive.match_title}</div>
      ))}
    </div>
  );
}
```

### With Filters
```typescript
import { useArchives } from '@/hooks/useArchives';
import { ArchiveFilters } from '@/types/archive';

function FilteredArchives() {
  const filters: ArchiveFilters = {
    format: 'T20',
    category: 'International',
    page: 1,
    per_page: 20
  };
  
  const { data, loading, error } = useArchives(filters);
  
  // ... render logic
}
```

### Direct API Call
```typescript
import { getArchives } from '@/lib/api/archives';

async function fetchArchives() {
  try {
    const response = await getArchives({
      format: 'ODI',
      date: '2025-12-31'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Failed to fetch archives:', error);
  }
}
```

## 🧪 Testing

### Test URLs
Once the server is running, test these URLs:

1. **All Archives:** http://localhost:3000/archive
2. **International Matches:** http://localhost:3000/archive?category=International
3. **T20 Format:** http://localhost:3000/archive?format=T20
4. **Specific Date:** http://localhost:3000/archive?date=2025-12-31
5. **Combined Filters:** http://localhost:3000/archive?category=Leagues&format=T20

### Running the Development Server
```bash
# Install dependencies (if needed)
npm install

# Start the development server
npm run dev

# Visit http://localhost:3000/archive
```

## 🔧 Configuration

### Environment Variables
Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

For production, update this to your production API URL:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

### Customization

#### Change Items Per Page
Edit the `filters` object in `app/archive/page.tsx`:
```typescript
const filters: ArchiveFilters = useMemo(() => {
  const f: ArchiveFilters = {
    page,
    per_page: 30, // Change this value
  };
  // ...
}, [category, format, date, page]);
```

#### Modify Grid Layout
Edit the grid classes in `app/archive/page.tsx`:
```typescript
{/* Current: 1 col mobile, 2 cols tablet, 3 cols desktop */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

{/* Example: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
```

## 🐛 Troubleshooting

### "Failed to load archives" Error

If you see this error, check these in order:

**1. Verify Backend API is Running**
```bash
# Test if your backend archives endpoint exists
curl https://api.8jjcricket.com/archives?per_page=1

# Or for local development
curl http://localhost:8000/api/archives?per_page=1
```

**2. Check Next.js API Route**
Open browser console (F12) and look for fetch errors. The API route will log:
- The backend URL it's trying to reach
- Response status codes
- Error details

**3. Verify Environment Variable**
Check `.env.local` has:
```env
BACKEND_ORIGIN=https://api.8jjcricket.com
```

**4. Restart Next.js Dev Server**
After changing environment variables, restart:
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

**5. Check Backend Response Format**
Your backend must return this structure:
```json
{
  "current_page": 1,
  "data": [...],
  "last_page": 10,
  "per_page": 30,
  "total": 300,
  ...
}
```

### API Connection Issues
If the archives don't load:
1. Check that your backend API is running
2. Verify the `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure the API endpoint returns the expected JSON structure

### CORS Errors
If you see CORS errors, configure your backend to allow requests from your Next.js app:
```javascript
// Example Express.js CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Type Errors
If you encounter TypeScript errors:
1. Ensure all imports use the correct paths
2. Run `npm run type-check` to see all type errors
3. Check that the API response matches the `ArchivesResponse` interface

## 📝 Future Enhancements

Potential improvements you could add:
- [ ] Search functionality for match titles
- [ ] Export archives to CSV
- [ ] Advanced filters (venue, season, etc.)
- [ ] Match details modal/page
- [ ] Favorite/bookmark matches
- [ ] Share match details
- [ ] Performance analytics dashboard
- [ ] Real-time updates with WebSockets

## 🤝 Contributing

When making changes to the archives feature:
1. Update type definitions in `types/archive.ts` if API changes
2. Update the API service in `lib/api/archives.ts` for new endpoints
3. Maintain the consistent design system
4. Test all filter combinations
5. Ensure mobile responsiveness
6. Update this README if needed

## 📄 License

This integration is part of the 8jjcricket.com project.

---

**Created:** January 1, 2026
**Last Updated:** January 1, 2026
**Version:** 1.0.0

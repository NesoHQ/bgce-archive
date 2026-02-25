# Z-Index Architecture & Stacking Context Solution

## Problem Statement
Navigation dropdowns were not appearing above hero sections due to stacking context issues caused by:
- `filter: blur(...)` creating new stacking contexts
- `overflow-hidden` on parent containers
- `backdrop-blur` effects
- Nested stacking contexts in page layouts

## Solution Implemented

### 1. Portal Component
Created a reusable Portal component that renders children directly to `document.body`, bypassing all stacking context issues.

**File:** `components/ui/Portal.tsx`

```typescript
"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
```

### 2. Z-Index Scale

Established a clear z-index hierarchy:

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Page Content | 0-999 | Regular page elements |
| Header | 10000 | Sticky navigation header |
| Dropdowns | 11000 | Navigation dropdowns, tooltips |
| Modals | 12000 | Modal dialogs (future) |
| Toasts | 13000 | Toast notifications (future) |

### 3. Header Configuration

Updated header with proper stacking context isolation:

```tsx
<header className="sticky top-0 z-[10000] relative isolate w-full">
```

**Key Properties:**
- `z-[10000]`: Places header above all page content
- `relative`: Creates positioned stacking context
- `isolate`: Prevents child elements from creating new stacking contexts that interfere with siblings

### 4. Dropdown Implementation

All three dropdowns now use Portal:

```tsx
{exploreOpen && (
  <Portal>
    <div className="fixed z-[11000] ...">
      {/* Dropdown content */}
    </div>
  </Portal>
)}
```

**Benefits:**
- Renders outside the header's stacking context
- Not affected by parent `overflow-hidden`
- Not affected by sibling `filter: blur()`
- Always appears on top of page content

### 5. Preserved Features

✅ **Hero blur effects remain intact:**
```tsx
<div className="absolute ... blur-3xl" />
```

✅ **Dynamic positioning still works:**
- `getBoundingClientRect()` calculations
- Scroll and resize listeners
- 8px gap below trigger buttons

✅ **Click outside to close:**
- Separate refs for buttons and dropdowns
- Proper event handling

✅ **Smooth animations:**
- 200ms transitions
- Fade-in and slide-in effects

## Architecture Rules

### For All Future Overlays

1. **Always use Portal for fixed overlays:**
   - Dropdowns
   - Modals
   - Tooltips
   - Popovers
   - Toast notifications

2. **Never render fixed overlays inside:**
   - Page layouts
   - Sections with `overflow-hidden`
   - Elements with filters or transforms
   - Nested stacking contexts

3. **Use the z-index scale:**
   - Don't use arbitrary z-index values
   - Follow the established hierarchy
   - Document any new layers

4. **Test with:**
   - Blur effects active
   - Overflow hidden on parents
   - Backdrop blur effects
   - Transform animations

## Validation Checklist

✅ Dropdowns appear above hero blur circles  
✅ Dropdowns appear above sections with backdrop-blur  
✅ Scroll does not break positioning  
✅ Resize recalculates positions correctly  
✅ Mobile navigation unaffected  
✅ Click outside closes dropdowns  
✅ Animations work smoothly  
✅ No TypeScript errors  
✅ Hero blur effects preserved  

## Production-Grade Standards

This implementation follows patterns used by:
- **Kaggle**: Portal-based dropdowns with dynamic positioning
- **GitHub**: Isolated overlay rendering with proper z-index hierarchy
- **Stripe**: Clean stacking context management
- **Educative**: Professional dropdown UX with Portal architecture

## Future Enhancements

Consider implementing:

1. **Centralized Overlay Manager:**
   - Single source of truth for all overlays
   - Automatic z-index management
   - Focus trap and keyboard navigation

2. **Z-Index Design System:**
   - CSS custom properties for z-index values
   - Centralized configuration
   - Type-safe z-index utilities

3. **Layered UI Hierarchy:**
   - Documented layer system
   - Visual stacking context debugger
   - Automated testing for overlay behavior

## Technical Notes

- Portal uses `createPortal` from React DOM
- Mounted state prevents SSR hydration issues
- All dropdowns maintain their own refs for positioning
- Fixed positioning with calculated coordinates
- No performance impact from Portal usage

# Gradient Design System

## Overview
Beautiful gradient backgrounds that adapt seamlessly between light and dark modes, creating a pleasing visual experience for all users.

---

## Design Philosophy

### Light Mode
- Subtle, soft gradients (5-10% opacity)
- Pastel color palette
- Gentle transitions
- Professional and clean

### Dark Mode
- More pronounced gradients (10-30% opacity)
- Deeper, richer colors
- Enhanced contrast
- Modern and immersive

---

## Gradient Patterns

### 1. Welcome Section
**Purpose**: Hero section with maximum visual impact

**Light Mode**:
```css
/* Base gradient */
bg-gradient-to-br from-primary/5 via-background to-primary/5

/* Animated orbs */
- Top-right: from-primary/20 via-primary/10 to-transparent
- Bottom-left: from-blue-500/10 via-purple-500/10 to-transparent
- Center: from-cyan-500/5 to-primary/5
```

**Dark Mode**:
```css
/* Base gradient */
bg-gradient-to-br from-primary/10 via-background to-primary/10

/* Animated orbs */
- Top-right: from-primary/30 via-primary/15 to-transparent
- Bottom-left: from-blue-500/20 via-purple-500/20 to-transparent
- Center: from-cyan-500/15 to-primary/15
```

**Features**:
- 3 animated gradient orbs with pulse effect
- Different animation durations (4s, 5s, 6s)
- Staggered delays for organic movement
- Tech grid overlay for depth

---

### 2. Popular Courses Section
**Purpose**: Highlight featured content

**Light Mode**:
```css
/* Background */
bg-gradient-to-b from-muted/30 via-muted/10 to-background

/* Accent orbs */
- Top-left: from-blue-500/10 to-transparent
- Bottom-right: from-purple-500/10 to-transparent
```

**Dark Mode**:
```css
/* Background */
bg-gradient-to-b from-muted/50 via-muted/20 to-background

/* Accent orbs */
- Top-left: from-blue-500/20 to-transparent
- Bottom-right: from-purple-500/20 to-transparent
```

**Card Gradients**:
```css
/* Light */
bg-gradient-to-br from-card to-card/80

/* Dark */
bg-gradient-to-br from-card to-card/50
```

---

### 3. Community Talks Section
**Purpose**: Engaging content showcase

**Light Mode**:
```css
/* Background */
bg-gradient-to-b from-background via-primary/5 to-background

/* Center orb */
from-cyan-500/5 via-primary/5 to-purple-500/5
```

**Dark Mode**:
```css
/* Background */
bg-gradient-to-b from-background via-primary/10 to-background

/* Center orb */
from-cyan-500/15 via-primary/15 to-purple-500/15
```

---

### 4. Archive Cards
**Purpose**: Content cards with depth

**Light Mode**:
```css
bg-gradient-to-br from-card/90 to-card/70

/* Hover overlay */
from-primary/5 to-transparent
```

**Dark Mode**:
```css
bg-gradient-to-br from-card to-card/60

/* Hover overlay */
from-primary/10 to-transparent
```

---

### 5. Footer
**Purpose**: Elegant page conclusion

**Light Mode**:
```css
/* Background */
bg-gradient-to-b from-background via-muted/20 to-muted/40

/* Accent orbs */
- Bottom-left: from-primary/10 to-transparent
- Top-right: from-blue-500/10 to-transparent
```

**Dark Mode**:
```css
/* Background */
bg-gradient-to-b from-background via-muted/30 to-muted/50

/* Accent orbs */
- Bottom-left: from-primary/20 to-transparent
- Top-right: from-blue-500/20 to-transparent
```

---

## UI Elements with Gradients

### Buttons

**Primary Button**:
```css
/* Light & Dark */
bg-gradient-to-r from-primary to-primary/90
hover:from-primary/90 hover:to-primary
shadow-lg shadow-primary/25
hover:shadow-xl hover:shadow-primary/30
```

**Outline Button**:
```css
bg-gradient-to-r from-background to-muted/50
hover:from-muted/50 hover:to-muted
```

### Badges

**Light Mode**:
```css
bg-gradient-to-r from-primary/10 to-primary/5
border-primary/20
```

**Dark Mode**:
```css
bg-gradient-to-r from-primary/20 to-primary/10
border-primary/30
```

### Text Gradients

**Headings**:
```css
/* Light */
bg-gradient-to-r from-primary via-primary/80 to-primary/60

/* Dark */
bg-gradient-to-r from-primary via-primary/90 to-primary/70

/* Apply */
bg-clip-text text-transparent
```

**Stats Numbers**:
```css
bg-gradient-to-br from-foreground to-foreground/70
bg-clip-text text-transparent
```

### Dividers

**Vertical**:
```css
bg-gradient-to-b from-transparent via-border to-transparent
```

**Horizontal**:
```css
bg-gradient-to-r from-transparent via-border to-transparent
```

---

## Code Window Gradients

### Window Background
```css
/* Light */
bg-gradient-to-br from-card to-card/80

/* Dark */
bg-gradient-to-br from-card to-card/50
```

### Window Header
```css
/* Light */
bg-gradient-to-r from-muted to-muted/80

/* Dark */
bg-gradient-to-r from-muted/80 to-muted/50
```

### Code Area
```css
/* Light */
bg-gradient-to-br from-background/50 to-muted/30

/* Dark */
bg-gradient-to-br from-background/30 to-muted/20
```

### Window Buttons
```css
/* Red */
bg-gradient-to-br from-red-500 to-red-600

/* Yellow */
bg-gradient-to-br from-yellow-500 to-yellow-600

/* Green */
bg-gradient-to-br from-green-500 to-green-600
```

---

## Animation Guidelines

### Pulse Animation
```css
animate-pulse
```

**Custom Durations**:
- Primary orb: 4s
- Secondary orb: 6s (delay: 1s)
- Tertiary orb: 5s (delay: 2s)

### Hover Transitions
```css
transition-all duration-300 ease-out
```

### Opacity Transitions
```css
opacity-0 group-hover:opacity-100
transition-opacity duration-300
```

---

## Color Palette

### Primary Colors
- **Primary**: Main brand color
- **Blue**: Cool accent (blue-500)
- **Purple**: Warm accent (purple-500)
- **Cyan**: Fresh accent (cyan-500)

### Opacity Levels

**Light Mode**:
- Subtle: 5%
- Light: 10%
- Medium: 20%
- Strong: 30%

**Dark Mode**:
- Subtle: 10%
- Light: 15%
- Medium: 30%
- Strong: 50%

---

## Best Practices

### Do's ✅
- Use gradients to create depth and hierarchy
- Maintain consistent opacity ratios between light/dark modes
- Layer gradients for rich visual effects
- Use blur-3xl for soft, diffused orbs
- Combine with backdrop-blur for glass morphism
- Animate gradients subtly with pulse
- Use text gradients for emphasis

### Don'ts ❌
- Don't use too many gradient orbs (max 3 per section)
- Don't make gradients too bright in light mode
- Don't use harsh color transitions
- Don't animate too fast (min 4s duration)
- Don't forget dark mode variants
- Don't overuse text gradients

---

## Accessibility

### Contrast Ratios
- Ensure text over gradients meets WCAG AA standards
- Test with both light and dark modes
- Use backdrop-blur for better text readability

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
```

---

## Implementation Checklist

- [x] Welcome Section gradients
- [x] Popular Courses Section gradients
- [x] Community Talks Section gradients
- [x] Archive Cards gradients
- [x] Footer gradients
- [x] Button gradients
- [x] Badge gradients
- [x] Text gradients
- [x] Code window gradients
- [x] Divider gradients
- [x] Dark mode variants
- [x] Animation timing
- [x] Backdrop blur effects

---

## Browser Support

All gradients use standard CSS properties supported by:
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS 14+, Android 5+)

**Fallbacks**:
- Solid colors for older browsers
- Graceful degradation without gradients

---

## Performance

### Optimization Tips
1. Use CSS gradients (not images)
2. Limit animated elements
3. Use `will-change: transform` sparingly
4. Leverage GPU acceleration with `transform`
5. Use `backdrop-blur` judiciously

### Metrics
- No impact on FCP (First Contentful Paint)
- Minimal impact on LCP (Largest Contentful Paint)
- Smooth 60fps animations
- No layout shifts

---

*Last Updated: 2026-02-25*
*Version: 1.0.0*

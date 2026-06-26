# Design System Documentation

## Overview

This design system defines the visual language, color palette, typography, and component library for the KhayyamPulse platform. It's designed to be modern, energetic, and accessible while maintaining a professional appearance.

---

## Color Palette

### Primary Colors

#### Neon (Primary Accent)
- **Neon-200**: `#c4ff00` - Main accent, CTA buttons, highlights
- **Neon-300**: `#b8ee00` - Hover state
- **Neon-400**: `#a3d900` - Secondary accent

**Usage**: Primary buttons, active states, data highlights, focus indicators

#### Dark Base
- **Graphite-950**: `#020617` - Darkest background (light mode)
- **Graphite-900**: `#0f172a` - Card backgrounds (light mode)
- **Background**: `#050816` - Main background (dark mode)
- **Card**: `#0f172a` - Card backgrounds (dark mode)

**Usage**: Page backgrounds, card backgrounds, text containers

### Secondary Color Palette

#### Emerald (Growth/Bullish)
- **Emerald-500**: `#22c55e` - Success states, bullish signals
- **Emerald-600**: `#16a34a` - Hover state
- **Usage**: Buy signals, positive indicators, growth metrics

#### Cyan (Interactive/Data)
- **Cyan-500**: `#06b6d4` - Interactive elements, secondary accent
- **Cyan-600**: `#0891b2` - Hover state
- **Usage**: Links, data visualization, interactive highlights

#### Violet (Premium/Special)
- **Violet-600**: `#9333ea` - Premium features, special actions
- **Violet-700**: `#7e22ce` - Hover state
- **Usage**: Premium badges, special cards, elevated actions

#### Rose (Alerts/Errors)
- **Rose-500**: `#ff1744` - Destructive actions, error states
- **Rose-600**: `#f4164f` - Hover state
- **Usage**: Sell signals, error messages, critical alerts

---

## Component Variants

### Buttons

#### Button Sizes
- **xs**: `h-8 px-3 text-xs`
- **sm**: `h-9 px-4 text-sm`
- **md**: `h-11 px-5 text-sm font-medium` (default)
- **lg**: `h-12 px-6 text-base font-semibold`
- **xl**: `h-14 px-8 text-base font-semibold`
- **icon**: `h-10 w-10`
- **icon-sm**: `h-8 w-8`
- **icon-lg**: `h-12 w-12`

#### Button Variants

1. **Primary (default)**
   ```tsx
   <Button variant="default">Primary Action</Button>
   ```
   - Background: Neon-200
   - Hover: Neon-300
   - Shadow: Neon glow effect
   - Use: Main CTAs, important actions

2. **Secondary**
   ```tsx
   <Button variant="secondary">Secondary Action</Button>
   ```
   - Background: Emerald-500
   - Hover: Emerald-600
   - Use: Alternative actions, buy signals

3. **Accent**
   ```tsx
   <Button variant="accent">Accent Action</Button>
   ```
   - Background: Cyan-500
   - Hover: Cyan-600
   - Use: Interactive elements, secondary CTAs

4. **Premium**
   ```tsx
   <Button variant="premium">Premium Action</Button>
   ```
   - Background: Violet-600
   - Hover: Violet-700
   - Use: Premium features, elevated actions

5. **Ghost**
   ```tsx
   <Button variant="ghost">Ghost Action</Button>
   ```
   - Background: Transparent
   - Hover: Primary/10
   - Use: Subtle actions, alternative options

6. **Outline**
   ```tsx
   <Button variant="outline">Outline Action</Button>
   ```
   - Border: Primary-2
   - Background: Transparent with hover tint
   - Use: Secondary selections, borders

7. **Destructive**
   ```tsx
   <Button variant="destructive">Delete</Button>
   ```
   - Background: Rose-500
   - Hover: Rose-600
   - Use: Delete actions, sell signals, errors

8. **Muted**
   ```tsx
   <Button variant="muted">Muted Action</Button>
   ```
   - Background: Muted
   - Use: Disabled-like but functional states

### Badges

#### Badge Variants

1. **Primary** (default)
   - Background: Neon-200 at 20% opacity
   - Text: Neon-700
   - Border: Neon-300 at 50% opacity
   - Use: Main tags, primary badges

2. **Secondary**
   - Background: Emerald-500 at 15% opacity
   - Text: Emerald-600
   - Use: Success tags, bullish indicators

3. **Accent**
   - Background: Cyan-500 at 15% opacity
   - Text: Cyan-600
   - Use: Interactive tags, data tags

4. **Premium**
   - Background: Violet-600 at 15% opacity
   - Text: Violet-600
   - Use: Premium features, special indicators

5. **Danger**
   - Background: Rose-500 at 20% opacity
   - Text: Rose-600
   - Use: Error states, sell signals, alerts

6. **Success**
   - Background: Emerald-500 at 15% opacity
   - Text: Emerald-600
   - Use: Completion, positive states

---

## Typography

### Font Scale
- **Display**: Text-4xl to 5xl, Font-bold, tracking-tight
  - Use: Page headers, main titles
- **Headline**: Text-2xl to 3xl, Font-semibold
  - Use: Section headers
- **Title**: Text-xl, Font-semibold
  - Use: Card headers, subsections
- **Body**: Text-base, Font-normal
  - Use: Regular text, descriptions
- **Caption**: Text-sm to xs, Font-normal
  - Use: Helper text, metadata

---

## Cards

### Card Structure
```tsx
<Card className="border-white/10 bg-white/5 backdrop-blur-xl">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

### Card Styling
- **Border**: `border-white/10` with 2px
- **Background**: `bg-white/5` with `backdrop-blur-xl`
- **Padding**: `p-6` for header/content
- **Rounded**: `rounded-2xl` or `rounded-xl`
- **Hover**: `hover:bg-white/10 transition-colors`

---

## Spacing

### Scale
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 12px (0.75rem)
- lg: 16px (1rem)
- xl: 24px (1.5rem)
- 2xl: 32px (2rem)
- 3xl: 48px (3rem)
- 4xl: 64px (4rem)

### Common Patterns
- **Gap between elements**: `gap-3` or `gap-4`
- **Section spacing**: `space-y-6` or `space-y-8`
- **Card padding**: `p-5` or `p-6`

---

## Shadows

### Shadow Scale
- **sm**: `shadow-sm`
- **base**: `shadow`
- **md**: `shadow-md`
- **lg**: `shadow-lg` with color overlay
- **xl**: `shadow-2xl` with color overlay

### Glow Effects
```tsx
/* For neon accent */
shadow-lg shadow-neon-200/20 hover:shadow-neon-200/40

/* For emerald */
shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40

/* For cyan */
shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
```

---

## Borders

### Border Styles
- **Subtle**: `border border-white/10`
- **Medium**: `border-2 border-white/10`
- **Accent**: `border-2 border-primary`
- **Dashed**: `border-2 border-dashed border-white/10`

### Border Radius
- **sm**: `rounded-lg` (8px)
- **md**: `rounded-xl` (12px)
- **lg**: `rounded-2xl` (16px)
- **full**: `rounded-full`

---

## Accessibility

### Color Contrast
- Text on backgrounds meets WCAG AA standards
- Interactive elements have visible focus states
- Color alone is not used to convey meaning

### Focus States
```tsx
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-ring 
focus-visible:ring-offset-2 
focus-visible:ring-offset-background
```

### Motion
- Transitions: `transition-all duration-200`
- Avoid auto-playing animations
- Respect `prefers-reduced-motion` setting

---

## Dark Mode

All components are designed to work seamlessly in dark mode using Tailwind's `dark:` prefix.

### Dark Mode Colors
- Background: Darker, more saturated
- Text: Lighter for contrast
- Cards: White/10 background with backdrop blur
- Borders: White/10 for subtle separation

### Example
```tsx
<div className="dark:bg-white/5 dark:text-white dark:border-white/10">
  {/* content */}
</div>
```

---

## Implementation Guidelines

### 1. Component Usage
- Always use the Button component, not custom buttons
- Use Badge for tags and labels
- Use Card for containers
- Import from `@/components/ui/`

### 2. Color Usage
- Use CSS variables from globals.css
- Apply via Tailwind classes: `bg-primary`, `text-primary`
- Never hardcode hex values

### 3. Responsive Design
- Mobile first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Use grid for layouts: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`

### 4. Performance
- Use CSS variables for dynamic theming
- Leverage Tailwind's purging for unused classes
- Minimize motion on interactions

### 5. Consistency
- Follow the spacing scale
- Use established color palette
- Maintain visual hierarchy
- Keep typography scale consistent

---

## Signal Colors

### Signal Mapping
- **Strong Buy**: Neon-200 (#c4ff00)
- **Probable Buy**: Neon-400 (#a3d900)
- **Hold**: Graphite-500 (#64748b)
- **Caution**: Warning color (#f59e0b)
- **Risk Sell**: Rose-600 (#f4164f)
- **Confirmed Sell**: Rose-500 (#ff1744)
- **Bullish**: Emerald-500 (#22c55e)
- **Bearish**: Rose-500 (#ff1744)
- **Neutral**: Graphite-400 (#94a3b8)

---

## Examples

### Primary Action Flow
```tsx
<Button variant="default" size="lg">
  <ScanSearch className="h-5 w-5" />
  Start Scan
</Button>
```

### Data Card
```tsx
<Card className="border-white/10 bg-white/5 backdrop-blur-xl">
  <CardContent className="flex items-center justify-between p-5">
    <div>
      <div className="text-sm text-foreground/60">Metric</div>
      <div className="mt-2 text-3xl font-bold text-foreground">42</div>
    </div>
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-400 text-white">
      <TrendingUp className="h-6 w-6" />
    </div>
  </CardContent>
</Card>
```

### Signal Badge
```tsx
<Badge variant="success">
  ✓ Buy Signal
</Badge>
```

---

## Changelog

### Version 1.0 (Current)
- Initial design system with neon accent palette
- Button, badge, and card component variants
- Dark mode support
- Accessibility guidelines
- Signal color mapping

---
name: Vibe Fluid Match
colors:
  surface: '#fbf8ff'
  surface-dim: '#d7d8f0'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#ececff'
  surface-container-high: '#e5e6ff'
  surface-container-highest: '#dfe1f9'
  on-surface: '#181a2c'
  on-surface-variant: '#464555'
  inverse-surface: '#2c2f41'
  inverse-on-surface: '#f0efff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#fbf8ff'
  on-background: '#181a2c'
  surface-variant: '#dfe1f9'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets young adults, digital nomads, and spontaneous communicators looking for immediate, frictionless, authentic 1-on-1 video and text connections. The brand personality is electric yet serene, unpretentious, and hyper-focused. The aesthetic pairs modern software minimalism with humanistic, airy glass surfaces and pristine optical clarity.

The interface prioritizes content and human expression above all else. By eliminating visual noise and chrome, it generates feelings of trust, safety, intimacy, and instantaneous discovery. Design principles rely on large, friendly radii, whisper-soft atmospheric shadows, crisp geometric typography, and radiant, luminous accents that mark interactive elements without overwhelming the primary video and communication streams.

## Colors

The palette is engineered around clean luminescence and distinct signal colors, balancing vibrant engagement with long-session comfort.

- **Canvas & Surface Tiers**: The base canvas is `#F7F8FC` (a cool, low-saturation tint that prevents eye strain), while raised interactive planes, controls, and message panels sit on `#FFFFFF`.
- **Primary Indigo (`#4F46E5`)**: Anchors critical conversion loops, connection triggers, dynamic search states, and hero calls to action.
- **Secondary Sky Blue (`#0EA5E9`)**: Designates discovery streams, active status highlights, and media-layer interactions.
- **Support & Semantics**: Success and verification states utilize Emerald Green (`#10B981`), system alerts or call disconnect actions use Danger Coral (`#EF4444`), while secondary text metadata rests on `#687086`. Structural demarcation relies on ultra-subtle hairlines using `#E6E8F0`.

## Typography

Typography is set exclusively in **Plus Jakarta Sans** to maintain an approachable, contemporary, and crisp digital aesthetic. 

- **Headlines & Display**: Employ tighter tracking (`-0.03em` to `-0.01em`) and bold-to-extrabold weights (`700` and `800`) to project confidence and modernity during onboarding and state transitions.
- **Body & Conversation**: Set at `400` weight with spacious line heights to ensure rapid, fatigue-free readability in scrolling chat streams.
- **Labels, Badges, & Indicators**: Utilize medium-to-bold weights (`600` and `700`) with neutral to slightly positive tracking for instant legibility at reduced sizes, critical for quick glanceability during live sessions.

## Layout & Spacing

The layout is built upon an adaptive 12-column fluid grid on desktop and tablet, collapsing to a single-column contextual canvas on mobile. 

- **Desktop (1024px+)**: Split dual-pane arrangement. The match viewport occupies the dominant left span (7 to 8 columns), while the interactive text stream, user info, and control dock occupy the remaining 4 to 5 columns. Fixed margins of `2rem` ensure structural breathing room.
- **Tablet (768px - 1023px)**: Responsive stacked canvas with overlay chat drawers or a 60/40 vertical split layout. Gutters compress to `1.25rem`.
- **Mobile (< 768px)**: Unified full-screen viewport. The incoming video feed spans 100% of the visible viewport height, with controls positioned in a floating thumb-zone bar and the live chat rendering as a semi-transparent floating cascade anchored to the lower-left edge. Margins contract to `1rem`.

## Elevation & Depth

Depth is established through soft, chromatic ambient dispersion rather than harsh physical drops. 

- **Base Level (Canvas)**: `#F7F8FC` flat surface.
- **Raised Interactive Cards (Level 1)**: Pure white `#FFFFFF` surface accompanied by a diffuse, colored shadow: `0 10px 30px rgba(79, 70, 229, 0.06)`, framed by a crisp `1px solid #E6E8F0` border.
- **Floating Controls & Modals (Level 2)**: Translucent white backdrop (`rgba(255, 255, 255, 0.85)`) backed by a `16px` backdrop-filter blur. Elevated via `0 20px 40px rgba(23, 26, 43, 0.08)`.
- **Active State Overlays**: Action controls emit an indigo or sky blue radiant glow (`0 0 24px rgba(14, 165, 233, 0.35)`) when active, creating an unmistakable operational cue in dark or light environments.

## Shapes

The design system adopts a deeply rounded geometry (`roundedness: 2` with standard radii scaling into extra-large radii) that feels natural, organic, and mobile-native:

- **Cards & Video Panels**: Formed using `rounded-2xl` (`1rem`) and `rounded-3xl` (`1.5rem` to `2rem`) corners to soften visual edges and frame faces harmoniously.
- **Inputs & Field Enclosures**: Utilize standard `rounded-xl` (`0.75rem` to `1rem`) profiles.
- **Pills & Badges**: Fully circular (`9999px`) border radius for status chips, live indicators, action icons, and primary quick-reply pills.

## Components

### Buttons & Action Controls
- **Primary Action (Start Match / Connect)**: High-contrast `#4F46E5` background, pure white text, fully pill-shaped (`9999px`), subtle bounce animation on hover, and an ambient indigo outer glow.
- **Secondary Action (Skip / Next Match)**: Clean `#FFFFFF` fill, `#171A2B` typography, `1px solid #E6E8F0`, transitioning to light sky blue tint on hover.
- **Destructive Action (Disconnect / Report)**: Soft Coral background (`#FEE2E2`), `#EF4444` label, shifting to solid red when confirmed.

### Audio & Video HUD Controls
- Circular floating utility buttons (`48px` or `56px`), rendered in semi-transparent frosted glass (`rgba(255, 255, 255, 0.9)`) on desktop or blurred dark translucency (`rgba(23, 26, 43, 0.6)`) over full-bleed video.
- Active states (e.g., Mic Muted, Cam Off) transition to high-visibility danger tints with animated pulse indicators.

### Chat & Message Streams
- **Incoming Messages**: Flat `#FFFFFF` bubble, `rounded-2xl` with a flattened bottom-left corner, `#171A2B` text, and fine `#E6E8F0` border.
- **Outgoing Messages**: Solid `#4F46E5` bubble, `rounded-2xl` with a flattened bottom-right corner, crisp white text.
- **Live Video Floating Mode**: Semi-translucent dark pill envelopes (`rgba(23, 26, 43, 0.45)`) with pure white high-contrast text and a soft blurred backdrop to preserve stream visibility.

### Chips & Badges
- Pill-shaped tags (`9999px`) with `space-xs` vertical and `space-sm` horizontal padding.
- Used for interest topics, regional filters, and connection status (e.g., Live Green dot with `#10B981` radial ping animation).

### Input Fields
- Message composer features a seamless full-width pill container with integrated emoji, media, and send shortcuts.
- Clear borders (`#E6E8F0`), transitioning to a `2px` focus ring in Indigo (`#4F46E5`) with zero inner shadow.
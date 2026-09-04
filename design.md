# DESIGN SYSTEM - LConfess

## 1. Design Direction

LConfess uses a **high-quality Neo-Brutalism** visual language.

The goal is not to make the website look like a random brutalist template.

It should feel like a real modern social product with:

* Strong typography
* Hard shadows
* Bold borders
* Flat colors
* Controlled asymmetry
* Playful motion
* Editorial layouts
* Strong visual hierarchy

The design should feel intentionally designed by a human designer.

---

# 2. Core Visual Principle

The visual formula:

```text
Bold Typography
+
Flat Color
+
Black/Dark Borders
+
Offset Shadows
+
Controlled Imperfection
+
Smooth Motion
=
LConfess
```

Avoid turning every component into a card.

Not everything needs:

```text
border-radius: 24px
```

Neo-Brutalism should use a mixture of:

* sharp corners
* slightly rounded corners
* rectangular containers
* oversized typography
* asymmetric layouts

---

# 3. Color System

Use a restrained palette.

## Primary

```text
Ink:
#111111

Paper:
#F6F3EA

Blue:
#5B7CFF

Yellow:
#FFD84D

Pink:
#FF6B9A

Green:
#8ED081

White:
#FFFFFF
```

Use black/dark ink for most borders and typography.

Do not use gradients as a primary visual element.

No:

```text
purple → blue gradient
pink → orange gradient
rainbow gradient
```

---

# 4. Typography

Use a bold modern sans-serif.

Preferred:

```text
Space Grotesk
```

Fallback:

```text
Inter
system-ui
sans-serif
```

Typography hierarchy:

### Hero

Very large.

```text
clamp(3.5rem, 10vw, 8rem)
```

Weight:

`800-900`

### Page Heading

```text
2.5rem - 4rem
```

Weight:

`800`

### Card Heading

```text
1.1rem - 1.5rem
```

Weight:

`700`

### Body

```text
1rem
```

Line-height:

`1.5`

Do not use tiny gray text for important information.

---

# 5. Borders

Primary border:

```text
3px solid #111111
```

Secondary:

```text
2px solid #111111
```

Borders should be visually obvious.

Avoid subtle 1px gray borders.

---

# 6. Shadows

Main Neo-Brutalist shadow:

```text
6px 6px 0 #111111
```

Large:

```text
10px 10px 0 #111111
```

Small:

```text
3px 3px 0 #111111
```

Never use huge blurred shadows.

Avoid:

```text
0 20px 50px rgba(...)
```

The shadow should feel physical and offset, not like generic SaaS elevation.

---

# 7. Border Radius

Use selectively.

Default:

```text
8px
```

Buttons:

```text
6px
```

Some feature cards:

```text
12px
```

Profile avatar:

`50%`

Do not globally apply one giant border radius.

---

# 8. Buttons

Buttons are major visual elements.

Primary button:

```text
background: #5B7CFF
color: #111111
border: 3px solid #111111
box-shadow: 5px 5px 0 #111111
```

Hover:

```text
transform: translate(2px, 2px)
box-shadow: 3px 3px 0 #111111
```

Active:

```text
transform: translate(5px, 5px)
box-shadow: 0 0 0 #111111
```

Transition:

```text
120-180ms
```

Buttons should feel tactile.

---

# 9. Header

Desktop:

```text
┌──────────────────────────────────────────────────┐
│ LCONFESS      Inbox  Profile  How it works       │
│                                      [Create]     │
└──────────────────────────────────────────────────┘
```

Header should not be a giant floating glass pill.

Use:

* strong bottom border
* solid background
* compact height
* bold logo

Mobile:

```text
┌─────────────────────────┐
│ LCONFESS          ☰     │
└─────────────────────────┘
```

Menu should animate naturally.

---

# 10. Logo

Wordmark:

```text
LCONFESS
```

Typography:

* uppercase
* bold
* tight letter spacing

Optional icon:

A simple abstract speech bubble / envelope shape.

Do not use:

* AI brain
* robot
* gradient blob
* generic chat icon with smile
* excessive 3D logo

---

# 11. Landing Page

## Hero

Desktop layout should be asymmetric.

Example:

```text
              LCONFESS

     SEND WHAT YOU
     WOULDN'T SAY
     OUT LOUD.

     ┌─────────────────────┐
     │ @username           │
     └─────────────────────┘

     [ Create your link ]

                    ┌──────────────┐
                    │ anonymous    │
                    │ message      │
                    │              │
                    │ "..."        │
                    └──────────────┘
```

Hero should feel editorial and energetic.

Do not center every element.

---

# 12. Hero Animation

Use subtle but noticeable motion.

Possible elements:

* message cards floating slightly
* text reveal
* button press animation
* decorative shapes moving slowly
* marquee text

Animation should have purpose.

Example:

```text
Message card:
opacity 0 → 1
translateY(20px) → 0
rotate(-3deg) → -1deg
```

Stagger:

`80-120ms`

Do not animate everything simultaneously.

---

# 13. Decorative Elements

Use simple geometric elements:

* stars
* circles
* arrows
* underlines
* hand-drawn style marks
* rectangular stickers

Examples:

```text
✦
↗
★
~
```

However, icons inside the actual interface should use SVG/icon components rather than decorative Unicode characters.

Decorations should never interfere with usability.

---

# 14. How It Works Section

Three steps:

```text
01
MAKE YOUR LINK

02
SHARE IT

03
GET ANONYMOUS MESSAGES
```

Use large numbers.

Each step can have a different accent background.

Avoid three identical rounded cards.

Instead use an editorial horizontal composition.

---

# 15. Public Profile Page

Example:

```text
┌────────────────────────────────────┐
│                                    │
│             [ avatar ]             │
│                                    │
│             Levi                   │
│             @levi                  │
│                                    │
│     "send me something honest."    │
│                                    │
└────────────────────────────────────┘

        SEND ANONYMOUS MESSAGE

┌────────────────────────────────────┐
│                                    │
│ Tell Levi something...             │
│                                    │
│                                    │
│ 0 / 500                            │
└────────────────────────────────────┘

[ SEND ANONYMOUSLY ]
```

The message composer is the main focus.

---

# 16. Message Composer

Composer should feel tactile.

Structure:

```text
┌───────────────────────────────┐
│                               │
│ What's on your mind?          │
│                               │
│                               │
│                               │
├───────────────────────────────┤
│ 500 characters       [ SEND ] │
└───────────────────────────────┘
```

Textarea:

* strong border
* paper background
* visible focus
* no excessive rounded corners

Focus state:

```text
border-color: #5B7CFF
box-shadow: 5px 5px 0 #111111
```

---

# 17. Send Animation

After successful send:

1. Button becomes loading.
2. Message disappears into a small envelope animation.
3. Success state appears.

Example:

```text
MESSAGE SENT.

Your secret is safe with the inbox.
```

Do not overdo the animation.

Maximum duration:

`500-700ms`

Respect reduced motion.

---

# 18. Dashboard

Dashboard should prioritize inbox.

Layout:

```text
┌──────────────────────────────────────────────┐
│ LCONFESS                         @levi       │
├──────────────┬───────────────────────────────┤
│              │                               │
│ Inbox        │  Inbox                        │
│ Profile      │                               │
│ Analytics    │  24 messages                  │
│ Settings     │                               │
│              │  ┌─────────────────────────┐  │
│              │  │ Anonymous               │  │
│              │  │ "..."                   │  │
│              │  │ 2 minutes ago           │  │
│              │  └─────────────────────────┘  │
│              │                               │
└──────────────┴───────────────────────────────┘
```

Desktop sidebar.

Mobile bottom navigation or compact top navigation.

---

# 19. Inbox Message Card

Message cards should not all look identical.

Use subtle variation while maintaining consistency.

Example:

```text
┌───────────────────────────────────┐
│ ANONYMOUS                    • NEW│
│                                   │
│ "Your message content..."         │
│                                   │
│ 4 MIN AGO                         │
│                                   │
│ [READ] [DELETE] [REPORT]          │
└───────────────────────────────────┘
```

Use accent colors sparingly.

Unread messages should have stronger visual weight.

---

# 20. Message Detail

Use a focused reading layout.

```text
← Back to inbox

ANONYMOUS

"Message content..."

Received 4 minutes ago

[ Mark unread ]

[ Delete ]

[ Report ]
```

Avoid opening a giant generic modal if a dedicated responsive panel is more usable.

---

# 21. Dashboard Statistics

Use brutalist stat blocks.

Example:

```text
┌──────────────┐
│ 24           │
│ MESSAGES     │
└──────────────┘

┌──────────────┐
│ 7            │
│ UNREAD       │
└──────────────┘
```

Large numbers.

Small labels.

Hard shadows.

---

# 22. Analytics

Charts should be simple.

Do not use:

* giant gradients
* glass cards
* excessive chart decoration

Use a simple line/bar chart with strong axes and typography.

The chart should answer:

`How many messages am I receiving?`

Nothing more.

---

# 23. Settings

Settings page should feel like a control panel.

Sections:

```text
ACCOUNT
PROFILE
PRIVACY
NOTIFICATIONS
SECURITY
DANGER ZONE
```

Danger Zone should visually communicate importance without becoming dramatic.

---

# 24. Toasts

Use compact notification blocks.

Example:

```text
┌────────────────────────────┐
│ ✓ Message deleted          │
└────────────────────────────┘
```

Toast:

* dark border
* solid background
* hard shadow

Animation:

```text
translateY(20px)
opacity: 0

→

translateY(0)
opacity: 1
```

---

# 25. Loading States

Do not use generic spinning circles everywhere.

Use skeletons where content layout is known.

Example:

```text
██████████████
████████
████████████████
```

For buttons:

```text
Sending...
```

Use spinners only where necessary.

---

# 26. Empty State

Inbox empty:

```text
NO MESSAGES YET.

Your inbox is quiet.

Share your link and let people
say what they normally wouldn't.
```

CTA:

```text
COPY MY LINK
```

Make the empty state visually interesting with one geometric illustration.

---

# 27. Error State

Example:

```text
SOMETHING BROKE.

We couldn't complete that action.

[ TRY AGAIN ]
```

Do not show:

```text
Error: TypeError...
Supabase request failed...
```

Technical errors belong in logs, not UI.

---

# 28. 404 Page

Make it part of the brand.

```text
404

THIS PAGE
DOESN'T EXIST.

Maybe someone deleted it.
Maybe it never existed.

[ GO HOME ]
```

Use a large `404` with Neo-Brutalist typography.

---

# 29. Motion System

Animation philosophy:

**Fast, physical, purposeful.**

Micro interactions:

`100-180ms`

Standard transitions:

`200-300ms`

Page transitions:

`300-500ms`

Large decorative animations:

`3-8s`

Use spring-like easing for tactile UI where appropriate.

Do not animate every element.

---

# 30. Hover Behavior

Desktop interactions should feel physical.

Button:

```text
rest:
shadow 5px 5px

hover:
shadow 3px 3px
translate 2px 2px

active:
shadow 0
translate 5px 5px
```

Cards:

Small translate or shadow change.

Do not make cards fly across the screen.

---

# 31. Page Transitions

Use subtle fade/slide.

Example:

```text
opacity: 0
translateY(8px)

→

opacity: 1
translateY(0)
```

Duration:

`250ms`

No cinematic transitions.

This is a messaging platform, not a Christopher Nolan film.

---

# 32. Mobile Navigation

Mobile navigation should be compact.

Potential structure:

```text
Home
Inbox
Profile
Settings
```

Use SVG icons.

Active state:

* stronger background
* bold text
* small accent marker

No giant floating glass navigation.

---

# 33. Icons

Use:

* Lucide
* custom SVG

Rules:

* consistent stroke width
* consistent size
* no emoji icons
* no random icon styles

Examples:

Inbox:

Envelope icon.

Settings:

Gear icon.

Report:

Flag icon.

Delete:

Trash icon.

Share:

Share icon.

---

# 34. Responsive Layout

Mobile:

```text
padding: 16px
```

Tablet:

```text
padding: 24px
```

Desktop:

```text
max-width: 1200-1280px
```

Avoid excessive whitespace on mobile.

Desktop can use asymmetric compositions.

---

# 35. Accessibility

Every interactive component must have:

* accessible label
* keyboard support
* focus state
* sufficient contrast

Motion must respect:

```text
prefers-reduced-motion: reduce
```

When reduced motion is enabled:

* disable decorative movement
* remove large transitions
* preserve essential state changes

---

# 36. AI-Slop Prevention Rules

This section is mandatory.

DO NOT generate:

* purple/blue AI gradients
* excessive glassmorphism
* huge rounded cards
* generic SaaS dashboards
* random blobs
* floating 3D objects
* stock illustrations
* robot illustrations
* "AI-generated" visual patterns
* excessive shadows
* 15 different accent colors
* excessive pill buttons
* every section centered
* giant text with no information
* meaningless decorative UI
* excessive blur
* generic landing-page template layouts

Do not use:

```text
rounded-[32px]
backdrop-blur
bg-gradient-to-r
```

as default styling patterns.

Neo-Brutalism must come from:

```text
Typography
Borders
Shadows
Composition
Color blocking
Spacing
Motion
```

not from randomly adding black borders to generic SaaS cards.

---

# 37. Anti-Template Rule

Every major page should have a distinct composition.

Landing:

Editorial + asymmetric.

Public profile:

Focused + personal.

Inbox:

Dense + functional.

Analytics:

Data-first.

Settings:

Control-panel.

404:

Playful.

Do not copy the same card grid into every page.

---

# 38. Visual Consistency

Maintain:

* same border language
* same shadow language
* same typography
* same spacing scale
* same interaction behavior

But allow different compositions.

Consistency does not mean every component must look identical.

---

# 39. Spacing System

Base:

```text
4px
8px
12px
16px
24px
32px
48px
64px
96px
128px
```

Use large spacing between major sections.

Use tighter spacing inside controls.

---

# 40. Component Architecture

Create reusable components:

```text
Button
Input
Textarea
Avatar
MessageCard
MessageComposer
ProfileHeader
StatBlock
Toast
Modal
Dropdown
Tabs
Navbar
Sidebar
BottomNav
EmptyState
ErrorState
Skeleton
ConfirmDialog
```

Components should be composable.

Do not duplicate styling across pages.

---

# 41. Frontend Architecture

Recommended structure:

```text
app/
├── page.tsx
├── login/
├── register/
├── forgot-password/
├── u/
│   └── [username]/
├── dashboard/
│   ├── page.tsx
│   ├── inbox/
│   ├── analytics/
│   ├── profile/
│   └── settings/
└── admin/

components/
├── ui/
├── auth/
├── profile/
├── messages/
├── dashboard/
└── admin/

lib/
├── supabase/
├── validation/
├── rate-limit/
├── moderation/
└── utils/
```

---

# 42. Design Tokens

Define tokens centrally.

Example:

```css
--ink: #111111;
--paper: #F6F3EA;
--blue: #5B7CFF;
--yellow: #FFD84D;
--pink: #FF6B9A;
--green: #8ED081;

--border: 3px;
--shadow-sm: 3px 3px 0 var(--ink);
--shadow-md: 6px 6px 0 var(--ink);
--shadow-lg: 10px 10px 0 var(--ink);

--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
```

Do not scatter hardcoded values throughout the application.

---

# 43. Implementation Principle

The final result should look like a designer deliberately made every visual decision.

It should NOT look like:

```text
AI generated SaaS template
+
random gradients
+
rounded cards
+
Lucide icons
+
Tailwind defaults
```

The design should have:

```text
personality
hierarchy
rhythm
contrast
restraint
```

---

# 44. Final Visual Test

Before considering the UI complete, inspect every page at:

```text
360 × 800
390 × 844
430 × 932
768 × 1024
1440 × 900
```

Check:

* No horizontal overflow.
* No clipped text.
* No overlapping elements.
* Buttons remain usable.
* Typography hierarchy remains strong.
* Shadows remain intentional.
* Navigation remains usable.
* Animations do not cause layout shifts.
* Empty states look designed.
* Error states look designed.
* Loading states look designed.

If a page looks like a generic AI-generated website, redesign the composition instead of adding more decoration.

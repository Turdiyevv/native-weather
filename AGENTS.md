# AGENTS.md - Vega App Development Guide

## Project Overview
**Vega** is a multi-user personal productivity mobile app built with Expo/React Native (TypeScript). Features: tasks, habits, business tracking, earnings, and chat. Supports 3 languages (Uzbek, Russian, English) with theme switching (light/dark/blue/orange).

Target: Android/iOS via Expo managed workflow.

---

## Architecture & Data Flow

### Multi-User System with Local Storage
- **All data persists locally** via AsyncStorage—no backend server
- **Active user pattern**: One user logged in at a time, `activeUser` key tracks current user
- **User structure**: [User][] in AsyncStorage["users"], each containing tasks, habits, business entries
- **Key service**: `service/storage.ts` — all CRUD operations for users, tasks, habits
- **Multi-user safety**: When deleting a user, all their data keys (prefixed `{username}_`) are purged

### Provider-Based State Architecture
App uses nested Context providers (see `App.tsx` root structure):
1. **SafeAreaProvider** → **GestureHandlerRootView** → **LanguageProvider** → **ThemeProvider** → **AppNavigator**
2. This layering is **required**; changing order breaks navigation or theme binding
3. Each provider manages independent concerns (i18n, theming); avoid mixing them

### Navigation Structure
- **Stack Navigator** (root): Handles auth flows, modal screens, full-screen views
- **Material Top Tabs** (`MainTabs.tsx`): Bottom tab bar with 5 main sections—Tasks, Habits, Business, Chat, Earnings
- **Custom Tab Bar**: Rendered via `MyTabBar()` component; styled with shadow, rounded corners, scale animations
- **Route Type System**: `RootStackParamList` in `pages/types/types.ts` enforces screen params; always update when adding routes

---

## Critical Developer Patterns

### Themes: Not Just Colors
- **4 built-in themes**: light, dark, blue, orange (defined in `theme/theme.ts`)
- **Sync theme to StatusBar**: `App.tsx` lines 137–139 set `barStyle` (dark-content/light-content) and `backgroundColor` reactively
- **Tab highlighting**: Active tab uses `theme.tabCard` (muted background) + `theme.primary` (icon color with 1.12 scale)
- **Always use theme colors** from context; never hardcode colors
- Usage: `const { theme } = useTheme()` → `theme.primary`, `theme.card`, `theme.background`, etc.

### Internationalization: Three-Language System
- **Language Context** (`i18n/LanguageContext.tsx`) is always required to be wrapped in provider
- **Translations structure**: `Record<Language, Record<string, string>>` — three nested objects (uz/ru/en)
- **Usage pattern**: `const { t } = useLanguage()` → `t("taskFieldsRequired")` returns localized string
- **Fallback chain**: Main translations → alert translations → key itself if missing
- **Persistence**: Selected language saved to AsyncStorage via `setLanguage()` on app load

### AsyncStorage: Username-Prefixed Keys
- Core data saved under `"users"` and `"activeUser"` as JSON strings
- Non-user data uses flat keys: `"appLanguage"`, `"appTheme"`
- **User-specific data** must use `{username}_taskId_extra` pattern for secondary storage
- **Batch operations**: Use `getAllKeys()` then `multiRemove()` for cleanup (e.g., user deletion)

### Task & Habit Core Models
```typescript
// Tasks: Full event lifecycle tracking
UserTask { id, title, description, done, deadline, time, status, isDeleted, files[], alarmDate?, notificationId? }
// Soft delete: Set isDeleted=true; hard delete removes from array entirely

// Habits: Duration-based recurring items
Habit { id, name, durationDays, createdAt, habitDays[] }
HabitDay { id, habitId, date (YYYY-MM-DD), notificationTime (HH:mm), status (0/1/2) }
// Status: 0=pending, 1=done, 2=skipped
```

### Business Module: Dual-Type Entries
- **BusinessItem**: Container for income/expense categories
- **BusinessEntry**: Individual transaction with `status` (true/false for income/expense toggle)
- **Pattern**: Entries grouped by date; UI shows date picker + category filters

---

## Component & Screen Patterns

### Reusable UI Components (components/global/)
- **TextField**: Text input with label, error message, optional validation
- **CheckBox**: Boolean toggle with color theming
- **Toggle**: Switch component styled per theme
- **ConfirmModal**: Yes/No dialog with message and handlers
- **DateTimePickerModalComponent**: Wrapper around @react-native-community/datetimepicker for consistent UX
- **FilePicker**: Expo document/media picker with error handling
- **Header**: App-wide header (used in tabs) with title + profile button
- **LanguageSelector**: Inline language picker
- **MenuBar**: Context menu system (see Task/TaskContextMenu.tsx for implementation)

### Common Component Props Pattern
Props are explicitly typed with interfaces in `pages/types/types.ts`:
- **TodoItemProps**: Task list item (label, action callbacks, handlers)
- **TextFieldProps**: Input (label, value, onChangeText, validation)
- **ConfirmModalProps**: Modal (visible, message, onConfirm, onCancel)
- When building a new component, add its props interface to types.ts first

### Smart Components with Menu/Animation
- **TaskRow** (components/Task/TaskRow.tsx): Example pattern for complex interactive component
  - Uses `useRef(new Animated.Value())` for smooth menu animations
  - `itemLayout` state tracks position for context menu placement
  - Long-press triggers vibration + menu open
  - Single-tap toggles task completion
- **Pattern**: Lift menu state to parent screen; pass `isMenuOpen`, `onOpenMenu`, `onCloseMenu` as props

---

## Screen Organization & Patterns

### Authentication Flow
1. **LoginPage**: Shows username/password or security code entry
2. **LoginCodePage**: Quick-entry screen for users with passwordCode set
3. **App.tsx** line 107–127: Initialization logic determines first route based on stored activeUser
4. **AppState listener** (lines 67–105): Locks app after 10 seconds in background if passwordCode exists

### Task Screen (pages/Tasks/)
- **TasksScreen**: Main grid view; filters by date, shows done/unfinished/archive tabs
- **ViewTask**: Modal detail view (read-only or editable)
- **AddPage**: Create/edit task with form validation
- **DescStyle**: Dedicated description editor (multi-line, formatted)
- **Pattern**: Pass full `UserTask` object in navigation params; fetch current user context in screen

### Habits & Business Screens
- **HabitsPage**: List view with status indicators (pending/done/skipped per day)
- **AddHabit**: Form for new habit; validates name + duration
- **Business**: TBD—tab placeholder
- **BusinessEntries**: Income/expense form; accepts type prop from nav params
- **IncomeAndExpenses**: Calendar view of all entries for selected date

### Service Layer Patterns (service/)
- **storage.ts**: O(n) synchronous CRUD on users array—no database queries
- **notification.ts**: Expo notifications schedule/cancel; checks language for localized titles
- **habits.ts**: Habit-specific logic (creation, date generation, status updates)
- **business.ts**: Transaction processing (sum calculations, export)
- **exportTasks.ts**: File generation (CSV/JSON) + Expo.Sharing
- **pattern**: All services are pure utility functions; no internal state

---

## Special Behaviors & Quirks

### AppState Management
- **appStateFlags** (`utills/appStateFlags.ts`): Global state object to track file picker open/ignore next state
- Updated when user puts app in background; checked on resume to trigger lock screen
- **Do not modify appStateFlags outside of App.tsx** unless you understand the timing implications

### Notification System
- Tasks and habits can have alarms
- **scheduleHabitDayNotification()**: Skips past dates, returns notificationId for tracking
- Notification ID stored in task/habitDay to allow cancellation
- Localized titles via language parameter

### Flash Messages
- **react-native-flash-message**: Top toast notifications for feedback
- Positioned absolutely in NavigationContainer (App.tsx lines 163–165)
- Use showMessage({ message, type }); position fixed—don't stack messages

### File/Image Handling
- **Avatar storage**: Stored as base64 or file URI in userinfo.avatar
- Uses `expo-image-picker` for gallery + camera access
- Uses `expo-document-picker` for file attachments
- File URIs may be invalidated on app restart if not persisted to AsyncStorage

---

## Development Workflow

### Starting the App
```powershell
npm install
npm start                  # Expo dev loader
npm run android            # Android emulator
npm run ios                # iOS simulator
npm run web                # Web browser (limited features)
```

### Adding a New Screen
1. Create file in `pages/{FeatureName}/ScreenName.tsx`
2. Add type to `RootStackParamList` in `pages/types/types.ts`
3. Import and add `<Stack.Screen>` in `App.tsx`
4. Use `useNavigation<NativeStackNavigationProp<RootStackParamList>>()` for typed navigation

### Adding a New Theme
1. Add variant to `themes` object in `theme/theme.ts` (copy light/dark structure)
2. Export new `ThemeName` type automatically includes it
3. Update theme picker UI (if present) to show new option
4. No provider changes needed—`ThemeProvider` is generic

### Translation Workflow
1. Add key/value to all three language objects in `translations` (uz, ru, en)
2. Add to alertTranslations if it's an alert message
3. Use `t("newKey")` in component; fallback is the key itself if missing
4. Test all three languages before shipping

### Debugging Multi-User State
- Open Expo DevTools: `d` in terminal
- Check AsyncStorage contents: React DevTools Inspector → Search for users/activeUser
- Simulate logout: Delete `activeUser` from storage and reload app
- Task visibility: Filter usertasks for current active user; avoid displaying wrong user's data

---

## File Structure Key Points

- **pages/**: Screen components, organized by feature
- **components/**: Reusable UI, organized into global/, Task/, Business/
- **service/**: Pure utility functions, no React
- **theme/**: Theme definitions, ThemeContext provider
- **i18n/**: Language definitions, LanguageContext provider
- **navigation/**: Navigation setup (MainTabs router)
- **utills/**: Global utility objects (appStateFlags, date helpers, ScrollContext)
- **pages/types/**: Central type definitions (RootStackParamList, interfaces)

---

## Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| Theme not updating UI | Ensure component uses `useTheme()` hook, not theme from props; re-render triggered by provider |
| Language not persisting | Call `setLanguage()` in LanguageProvider, not directly; manually calling AsyncStorage is redundant |
| Wrong user's data displayed | Always fetch current user via `getActiveUser()` before filtering tasks/habits |
| Notification not firing | Check date is in future; habitDay status must be 0 (pending); language param must match available translations |
| AsyncStorage race conditions | Use `async/await`; order: fetch all users → modify → save all; avoid simultaneous writes |
| App resets to LoginPage | Check activeUser is set; verify passwordCode logic in App.tsx lines 118–119 |

---

## Recommended Reading Order
1. **App.tsx** — Entry point, provider setup, auth initialization, AppState logic
2. **pages/types/userTypes.ts** — Data model definitions (User, UserTask, Habit, etc.)
3. **service/storage.ts** — All CRUD patterns
4. **theme/ThemeContext.tsx** + **theme/theme.ts** — How theming works end-to-end
5. **i18n/LanguageContext.tsx** — i18n provider and translation loading
6. **navigation/MainTabs.tsx** — Custom tab bar implementation, navigation setup
7. **pages/Tasks/TasksScreen.tsx** — Example complex screen with state, context, and filtering



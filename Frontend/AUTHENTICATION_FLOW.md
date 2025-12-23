# Authentication Flow - LifeLine 24x7

## Overview
The application now has a complete authentication flow connecting the Login page to the Dashboard.

## How It Works

### 1. **Login Process** (`Login.tsx`)
- User enters email and password
- On form submission:
  - Credentials are validated (currently simulated)
  - Auth token is stored in `localStorage`
  - User is automatically redirected to `/dashboard` using `useNavigate()`

### 2. **Protected Routes** (`ProtectedRoute.tsx`)
- A wrapper component that checks for authentication
- If `authToken` exists in `localStorage`, allows access
- If not authenticated, redirects to `/login`

### 3. **Dashboard Access** (`Dashboard.tsx`)
- Only accessible when user is authenticated
- Displays hospital overview with patient data
- Includes logout functionality

### 4. **Logout Process**
- Click "Sign Out" button in Dashboard sidebar
- Clears authentication tokens from `localStorage`
- Redirects back to `/login` page

## File Changes

### Modified Files:
1. **`Login.tsx`**
   - Added `useNavigate` hook
   - Implemented `navigate('/dashboard')` on successful login
   - Stores auth token in localStorage

2. **`Dashboard.tsx`**
   - Added `useNavigate` hook
   - Created `handleLogout()` function
   - Added logout functionality to Sign Out button

3. **`App.tsx`**
   - Added Dashboard route: `/dashboard`
   - Wrapped Dashboard with `ProtectedRoute` component
   - Imported Dashboard component

### New Files:
4. **`ProtectedRoute.tsx`**
   - Authentication guard component
   - Checks for `authToken` in localStorage
   - Redirects unauthorized users to login

## Routes

| Path | Component | Protection |
|------|-----------|------------|
| `/` | Redirect to `/login` | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | Protected |

## Testing the Flow

1. **Start the dev server:**
   ```bash
   cd Frontend
   npm run dev
   ```

2. **Test Login:**
   - Navigate to `http://localhost:5173/login`
   - Enter any email and password
   - Click "Login"
   - Should redirect to Dashboard

3. **Test Protected Route:**
   - Try accessing `http://localhost:5173/dashboard` directly without logging in
   - Should redirect back to `/login`

4. **Test Logout:**
   - From Dashboard, click "Sign Out" button
   - Should clear tokens and redirect to `/login`

## LocalStorage Keys

- `authToken`: Stores authentication token
- `userEmail`: Stores logged-in user's email
- `theme`: Stores user's theme preference (dark/light)

## Next Steps (TODO)

- [ ] Implement actual API authentication
- [ ] Add JWT token validation
- [ ] Add error handling for failed login attempts
- [ ] Add loading states
- [ ] Implement token refresh mechanism
- [ ] Add "Remember Me" functionality
- [ ] Connect to backend authentication service

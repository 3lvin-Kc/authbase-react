# authbase-react : This is an early project. The goal is correctness first, adoption later.

A dead simple auth state manager for React. No magic, no suprises.

## What is this?

This is just a state machine that holds your auth tokens and user data. That's it. It doesn't authenticate anyone, it doesn't talk to Supabase or Firebase or whatever. It just manages the logged-in/logged-out state on the frontend.

Think of it like useState but spacifically for auth stuff.

## Why does this exist?

Because every time I start a new React project, I end up writing the same auth boilerplate. Login form, logout button, protect some routes, store tokens in localStorage... you know the drill.

I got tired of copy-pasting this code around, so I made a library. Maybe you'll find it usefull too.

## What it does

- Manages login/logout state
- Stores tokens in localStorage (or wherever you want)
- Gives you hooks to check if someone's logged in
- Protects routes that need authentication
- Handles token refresh when you tell it to

## What it does NOT do

- No OAuth flows (build that yourself)
- No cookie auth (we use tokens)
- No automatic background token refresh (you call refresh when needed)
- No fancy UI components
- No backend (you need to build your own API)

## Install

```bash
npm install authbase-react
```

## Basic setup

Wrap your app:

```jsx
import { AuthProvider } from 'authbase-react';

const authConfig = {
  endpoints: {
    login: 'https://your-api.com/auth/login',
    refresh: 'https://your-api.com/auth/refresh',
    logout: 'https://your-api.com/auth/logout',
  },
};

function App() {
  return (
    <AuthProvider config={authConfig}>
      <YourApp />
    </AuthProvider>
  );
}
```

That's it. Now you can use the hooks anywhere. Pretty simple right?

## Make a login form

```jsx
import { useAuth } from 'authbase-react';

function LoginPage() {
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // user is now logged in baby
    } catch (err) {
      // error is in the error state, you know what to do?
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

## Protect routes

```jsx
import { RequireAuth } from 'authbase-react';

function Dashboard() {
  return (
    <RequireAuth redirectTo="/login">
      <YourDashboard />
    </RequireAuth>
  );
}
```

If the user isn't logged in, they get redirected to /login. Simple as that.

## Check if someone's logged in

```jsx
import { useIsAuthenticated } from 'authbase-react';

function Navigation() {
  const isLoggedIn = useIsAuthenticated();

  return (
    <nav>
      {isLoggedIn ? (
        <a href="/dashboard">Dashboard</a>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}
```

## Get user data

```jsx
import { useUser } from 'authbase-react';

function Profile() {
  const user = useUser();

  if (!user) return null;

  return <div>Hey {user.name}!</div>;
}
```

## Logout

```jsx
import { useAuth } from 'authbase-react';

function LogoutButton() {
  const { signOut } = useAuth();

  return <button onClick={signOut}>Logout</button>;
}
```

## Refresh tokens manually

```jsx
import { useAuth } from 'authbase-react';

function SomeComponent() {
  const { refresh, accessToken } = useAuth();

  const callAPI = async () => {
    let response = await fetch('/api/data', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 401) {
      // token expired, fuckin' refresh it
      await refresh();
      // now let it try again with the new token folks....
    }
  };
}
```

## Backend contract

Your backend needs to match this:

**Login endpoint:**
```
POST /auth/login
Body: { identifier: string, secret: string }
Response: {
  access_token: string,
  refresh_token?: string,
  user: object
}
```

**Refresh endpoint (optional):**
```
POST /auth/refresh
Headers: Authorization: Bearer {refresh_token}
Response: {
  access_token: string
}
```

**Logout endpoint (optional):**
```
POST /auth/logout
Headers: Authorization: Bearer {access_token}
Response: 204
```

That's all we support right now. If your API looks different, this library won't work for you (yet). Sorry bout that.

## Custom storage

By default we use localStorage. Want sessionStorage instead? Easy peasy.

```jsx
const authConfig = {
  endpoints: { /* ... */ },
  storage: window.sessionStorage,
};
```

## Available hooks

**useAuth()** - Everything
```jsx
const {
  signIn,        // (identifier, secret) => Promise<void>
  signOut,       // () => Promise<void>
  refresh,       // () => Promise<void>
  user,          // object | null
  accessToken,   // string | null
  isAuthenticated, // boolean
  isLoading,     // boolean
  error,         // Error | null
} = useAuth();
```

**useUser()** - Just the user object

**useIsAuthenticated()** - Just a boolean, yep

## Philosophy

This library is intentionally boring. There's no clever tricks, no abstractions, no "magic". It's just a state machine that stores some data. Boring is good sometimes.

We don't do automatic token refresh because that's complicated and every app needs it differently. Just call `refresh()` when you need it. Simple.

We don't support OAuth because that's a whole different beast. Build your OAuth flow, then use this library to store the result. Makes sense right?

We don't have fancy loading states or retry logic because your app probably needs custom handling anyway. You know your app better than we do.

## When NOT to use this

- You need OAuth social login (use next-auth or similar, seriously)
- You use cookie-based auth (this is for tokens only)
- You need SSR/Next.js support (maybe later)

- You want something that "just works" with zero config (this needs backend work, sorry)

## Contributing

Found a bug? Open an issue. Want to add something? Check out CONTRIBUTING.md for the full contribution guide.


## License

MIT - do whatever you want with it, seriously!!!!!!!!!

## Questions?

Open an issue and I'll try to help. No guarantees but I'll do my best.

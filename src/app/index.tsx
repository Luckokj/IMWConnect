import { Redirect } from 'expo-router';

// Static redirect from the root to /login. Using Redirect avoids imperative
// navigation before the root layout is mounted.
export default function Index() {
  return <Redirect href="/login" />;
}

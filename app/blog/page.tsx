import BlogPage from "./_components/BlogPage";

// Server boundary kept minimal so static export (no `cookies()` available)
// can build this route. The blog theme mode is now read client-side from
// the cookie inside BlogShell.
export default function Page() {
  return <BlogPage />;
}

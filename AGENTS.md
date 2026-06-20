<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

- use shadcn mcp for new components added
- use docs resources to implement api layer
- use cacheComponents structure, differ static shells from dynamic parts, cache the public data with revalidation Cache keys, 
- Follow code splitting rules to differ client necessary parts from server parts, lazyLoad unnecessary js nad under first viewport Client components, Wrap Dynamic sections nad client components inside static nad server shells in a Suspense  with proper loading skeleton
- use only lucide-react for icons, use nuqs for searchParams and so in client sides, use zustand for client global state managements

- use this pattern for structure:
+ Server Side rendering for pages with static data
+ ReactQuery Hydration for userSpecific dynamic data rendering on page
+ for mutations: ReactQuery in client component > Server Action > Server Side Services Defined per Entity Scope > Server Side  Global Request Handler (to manage auth token setting and so)
+ pass teh action function as arg to the runTrustedAction util function to handle the errors globally

- use react-next-performance SKILL for performance Optimization regards



<!-- END:nextjs-agent-rules -->

# Contributing

Thanks for considering contributing to authbase-react. Here's how to help out.

## Before you start

This library has a very specific philosophy: **keep it simple and boring**. We're not trying to be the next big auth framework. We're just managing state.

If you want to add a feature, ask yourself:
- Does this make the library more complicated?
- Could this be built as a separate package instead?
- Will this confuse someone reading the code in 6 months?

If yes to any of those, maybe don't add it. Seriously.

## What we're looking for

**Bug fixes** - Always welcome. If something's broken, let's fix it.

**Documentation improvements** - Typos, unclear examples, missing info. All good.

**Tests** - We need more tests. If you want to add test coverage, that's great.

**TypeScript improvements** - Better types, stricter checks, fixing any issues.

## What we're NOT looking for

**OAuth support** - Too complex. Build it separately.

**SSR/Next.js adapters** - Maybe someday, but not version 0.1.

**Background token refresh** - Intentionally not included. Apps have different needs.

**UI components** - This is a state library, not a component library.

**Alternative auth flows** - Cookie auth, session auth, etc. Out of scope.

**More configuration options** - Every option makes the library harder to understand.

If you really want one of these features, fork the repo and make your own version. That's totally fine. No hard feelings.

## How to contribute

### Reporting bugs

Open an issue with:
- What you expected to happen
- What actually happened
- Code example that shows the bug
- Your React version

### Suggesting changes

Open an issue first before writing code. Let's discuss if it fits the project.

Include:
- What problem you're solving
- Why the current code doesn't work
- How you'd implement it

### Submitting code

1. Fork the repo
2. Create a branch (`git checkout -b fix-something`)
3. Make your changes
4. Write or update tests if needed
5. Make sure TypeScript compiles (`npm run build`)
6. Commit with a clear message
7. Push and open a pull request

Keep PRs small. One thing at a time. Easier to review. Trust me on this one.

## Code style

Just be consistent with what's already there. We're not too strict about this.

- Use TypeScript
- Add comments when something isn't obvious
- Keep functions small
- Name things clearly

Don't use any fancy patterns or abstractions. Code should be readable by someone who just learned React.

## Testing

We need test coverage. If you're adding tests:

- Use whatever testing library you want (Jest, Vitest, etc)
- Test the reducer thoroughly
- Test hooks behavior
- Test storage edge cases

Don't worry about 100% coverage. Just test the important stuff. Perfect is the enemy of good here.

## Documentation

If you change behavior, update the README. If you add features (which we probably won't), document them clearly with examples.

Keep it simple. No marketing speak. Just "here's what it does and here's how to use it."

## Questions?

Not sure if your idea fits? Just open an issue and ask. Better to ask before spending time on code that might not get merged. I've been there.

## What happens after you submit?

I'll review it when I have time. Could be a day, could be a week. Life gets busy.

If I ask for changes, don't take it personally. Sometimes an idea just doesn't fit the project goals.

If your PR sits for a while, ping me. I probably just forgot. Happens to the best of us.

## License

By contributing, you agree your code will be released under the MIT license, same as the rest of the project.

---

That's it. Keep things simple and let's build something useful together.

---
name: GitHub push rejected on new repos
description: Why a push to a GitHub repo you own can still fail with PUSH_REJECTED, and what to check.
---

When pushing to a GitHub repository from Replit via the `gitPush` callback, the remote can return `PUSH_REJECTED` even if the repository exists, is public, and is owned by the same account. The most common causes are:

1. **Branch protection rules** on `main` that require pull requests or status checks.
2. **Repository rules** that block force pushes or require signed commits.
3. The Replit-linked GitHub app/token does not have **write access** to that specific repository.

**Why:** Replit's push callback uses the GitHub account you connected to Replit, but per-repo branch protection or app permissions can still block writes. This is not an error in the local code or git history.

**How to apply:**
- Check the repo's **Settings → Branches / Rules** and disable protection for `main` if you want direct pushes, or use a Personal Access Token with the correct scopes.
- Verify that the Replit GitHub app has write access to the repository under **Settings → Applications**.
- As a fallback, push manually from your local machine with `git push -u origin main` using your own credentials.

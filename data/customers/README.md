# Customer data

This directory is reserved for local-only development staging. Git ignores every other file in this directory.

Do not store production customer information in the repository. Use:

- Synthetic test records during development
- An access-controlled, encrypted database in deployed environments
- Least-privilege access and audit logging
- A documented retention and deletion policy

Never store raw payment-card data.

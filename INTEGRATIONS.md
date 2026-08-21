# Integration Audit

## Server-side model gateway

The chat experience uses the platform-supported `invokeLLM` helper only on the server. The protected model catalogue exposes available models to the authenticated UI without exposing gateway credentials. The verified catalogue includes Google Gemini model options.

## Google Gemini

The project has a server-only `GEMINI_API_KEY` secret. A Vitest health check validates access through Google’s model catalogue endpoint, and the protected `integrations.geminiStatus` procedure provides a credential-safe availability status for the settings screen. The browser never receives the secret.

## Google Workspace and Drive

The app links to the verified Drive-hosted GPT-OSS Colab notebook and its Hindi setup guide. Drive files remain external user-owned resources rather than being copied into the deployed app.

## Antigravity CLI

The official Antigravity CLI was installed and verified in the development environment as `agy` version 1.1.17. It is configured to use the authorized Gemini provider without storing the API key on disk. This local developer CLI is not bundled into the web application runtime.

## GitHub

GitHub CLI access is available for the authorized `balajirajput96` account and will be used to create or update the private source repository after app validation.


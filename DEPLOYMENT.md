# Deployment Guide for SnapBeautify

This guide provides instructions for deploying SnapBeautify to both a subdomain and a main domain.

## Prerequisites

- A Vercel account (or other hosting provider)
- Domain name(s) configured in your DNS settings
- Node.js and npm installed locally

## Environment Setup

1. Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Edit the `.env.local` file to set the appropriate base URL:

```
# For subdomain deployment
NEXT_PUBLIC_BASE_URL=https://snapbeautify.denistarasenko.com

# For main domain deployment (when ready)
# NEXT_PUBLIC_BASE_URL=https://snapbeautify.com
```

## Deployment to Subdomain (snapbeautify.denistarasenko.com)

### Using Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in Vercel:

   - Go to https://vercel.com/new
   - Select your repository
   - Configure the project:
     - Set the Framework Preset to "Next.js"
     - Add the environment variable:
       - Name: `NEXT_PUBLIC_BASE_URL`
       - Value: `https://snapbeautify.denistarasenko.com`

3. Deploy the project

4. Configure your custom subdomain:
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your subdomain: `snapbeautify.denistarasenko.com`
   - Follow the DNS configuration instructions provided by Vercel

### Manual Deployment

If you're not using Vercel, follow these steps:

1. Build the project:

```bash
npm run build
```

2. Deploy the `.next` folder to your hosting provider

3. Configure your server to serve the Next.js application

4. Set up the environment variable `NEXT_PUBLIC_BASE_URL` on your server

## Deployment to Main Domain (snapbeautify.com)

When you're ready to deploy to the main domain, follow the same steps as above, but use `https://snapbeautify.com` as the base URL.

### Using Vercel

1. Update the environment variable in your Vercel project:

   - Name: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://snapbeautify.com`

2. Add your main domain in the Domains settings:
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your domain: `snapbeautify.com`
   - Follow the DNS configuration instructions provided by Vercel

### Manual Deployment

1. Update your `.env.local` file:

```
NEXT_PUBLIC_BASE_URL=https://snapbeautify.com
```

2. Rebuild and redeploy the application

## Verifying Your Deployment

After deployment, verify that your SEO settings are working correctly:

1. Check the meta tags in the HTML source
2. Validate the OpenGraph tags using the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
3. Validate the Twitter Card using the [Twitter Card Validator](https://cards-dev.twitter.com/validator)
4. Check the structured data using [Google's Rich Results Test](https://search.google.com/test/rich-results)
5. Verify the sitemap is accessible at `/sitemap.xml`
6. Verify the robots.txt is accessible at `/robots.txt`

## Switching Between Environments

To switch between the subdomain and main domain:

1. Update the `NEXT_PUBLIC_BASE_URL` environment variable
2. Rebuild and redeploy the application

## Troubleshooting

- If OpenGraph images aren't showing up, make sure they're being generated correctly
- If the sitemap or robots.txt isn't accessible, check your server configuration
- If structured data isn't validating, check the JSON-LD in the page source

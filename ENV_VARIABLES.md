# Environment Variables for Vercel Deployment

## Required Amazon SP-API Environment Variables

To enable Amazon SP-API integration in your Vercel deployment, you need to set the following environment variables in your Vercel project settings:

### Required Variables

1. **AMAZON_REFRESH_TOKEN**
   - Your Amazon SP-API refresh token
   - Get this from your Amazon SP-API app authorization flow
   - Example: `Atzr|IwEBIA...`

2. **AMAZON_LWA_APP_ID** 
   - Your application's Login with Amazon App ID
   - Get this from Amazon Seller Central Developer Console
   - Example: `amzn1.application-oa2-client.xyz...`

3. **AMAZON_LWA_CLIENT_SECRET**
   - Your application's Login with Amazon Client Secret  
   - Get this from Amazon Seller Central Developer Console
   - Example: `amzn1.oa2-cs.v1.abc...`

### Optional Variables

4. **AMAZON_SELLER_ID** (optional)
   - Your Amazon Seller ID
   - Defaults to `A13NBKN6I076SR` if not provided
   - Example: `A1B2C3D4E5F6G7`

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with its corresponding value
5. Make sure to set them for all environments (Production, Preview, Development)

## Security Note

Never commit these values to your repository. They should only be set in Vercel's environment variable settings. 
# Amazon SP-API Integration for Dashboard

This integration allows you to search Amazon products directly from your dashboard and add them to your inventory.

## Features

- **Product Search**: Search Amazon by keyword, ASIN, or UPC
- **Real-time Buybox Price**: Get current competitive pricing data
- **Category Information**: Automatic category detection from Amazon
- **One-click Import**: Add Amazon products directly to your inventory
- **Modern UI**: Beautiful modal interface with tabs and search filters

## Setup Instructions

### 1. Backend Setup (Flask Server)

#### Install Python Dependencies

```bash
pip install flask flask-cors python-amazon-sp-api requests urllib3
```

#### Configure SP-API Credentials

1. Edit `scripts/start-backend.py`
2. Replace the commented credentials section with your actual SP-API credentials:

```python
credentials = dict(
    refresh_token='YOUR_REFRESH_TOKEN',
    lwa_app_id='YOUR_LWA_APP_ID',
    lwa_client_secret='YOUR_LWA_CLIENT_SECRET',
    seller_id='YOUR_SELLER_ID'  
)
```

3. Uncomment the SP-API imports at the top of the file:

```python
from sp_api.base import Marketplaces, SellingApiException
from sp_api.api import Products
from sp_api.api import CatalogItems
```

4. Replace the mock functions with your original SP-API implementation

#### Start the Flask Backend

```bash
cd scripts
python start-backend.py
```

The server will start on `http://localhost:5002`

### 2. Frontend Setup (Next.js)

The frontend integration is already complete! The following components have been added:

- `components/products/amazon-product-search.tsx` - Main search modal
- `lib/api-config.ts` - API configuration
- Products page integration - Search button in the "Add New Products" section

### 3. Environment Configuration (Optional)

You can set a custom Flask backend URL by adding to your `.env.local`:

```bash
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5002
```

## How to Use

1. **Open the Products Page**: Navigate to the Products section in your dashboard
2. **Click "Search Amazon"**: Look for the button in the "Add New Products" section
3. **Choose Search Type**: 
   - **Keyword**: Search by product name or description
   - **ASIN**: Search by Amazon Standard Identification Number
   - **UPC**: Search by Universal Product Code
4. **Enter Search Term**: Type your search query and click "Search"
5. **Browse Results**: View product details, images, and pricing
6. **Get Buybox Price**: Click "Get Price" to fetch current competitive pricing
7. **Select Product**: Click on any product card to add it to your inventory

## Features Breakdown

### Search Types

- **Keyword Search**: Finds products matching your search terms
- **ASIN Search**: Direct lookup by Amazon's unique identifier
- **UPC Search**: Find products by their barcode

### Product Information

Each search result includes:
- Product title and image
- ASIN and UPC codes
- Category information
- MSRP pricing
- Real-time buybox pricing (on demand)

### Automatic Import

When you select a product, it's automatically converted to your inventory format:
- **Name**: Amazon product title
- **SKU**: Generated as `AMZ-{ASIN}`
- **Cost**: Estimated at 70% of MSRP
- **Selling Price**: Uses buybox price or MSRP
- **Condition**: Defaults to "New"
- **Image**: Amazon product image

## API Endpoints

The Flask backend provides these endpoints:

- `POST /api/amazon/search` - Search for products
- `GET /api/amazon/buybox/{asin}` - Get buybox pricing for an ASIN
- `GET /test` - Health check endpoint

## Development Notes

### Mock Mode

The current implementation includes mock data for testing without SP-API credentials. To switch to real SP-API:

1. Add your credentials to the Flask script
2. Uncomment the SP-API imports
3. Replace mock functions with actual SP-API calls
4. Install the `cache_manager` dependency (or remove caching decorators)

### Error Handling

The integration includes comprehensive error handling:
- Network connectivity issues
- Invalid search terms
- SP-API rate limiting
- Missing product data

### Performance

- **Caching**: SP-API responses are cached to reduce API calls
- **Lazy Loading**: Buybox prices are fetched on demand
- **Parallel Requests**: Multiple buybox requests can run simultaneously

## Troubleshooting

### Backend Not Starting

1. Check Python dependencies are installed
2. Verify port 5002 is available
3. Check Flask server logs for errors

### Search Not Working

1. Verify Flask backend is running
2. Check browser console for CORS errors
3. Test the `/test` endpoint: `http://localhost:5002/test`

### No Search Results

1. Try different search terms
2. Check SP-API credentials are valid
3. Verify internet connectivity
4. Review Flask server logs

### Buybox Price Issues

1. Ensure ASIN is valid
2. Check SP-API rate limits
3. Some products may not have buybox data

## Customization

### Styling

The search modal uses your existing design system with gradient backgrounds and modern UI components. You can customize:

- Colors in the component files
- Layout in `amazon-product-search.tsx`
- API configuration in `lib/api-config.ts`

### Data Mapping

To change how Amazon products are converted to your inventory format, edit the `handleAmazonProductSelect` function in `app/products/page.tsx`.

### Search Behavior

Modify search parameters in the `searchProducts` function in `amazon-product-search.tsx`.

## Security Notes

- Never commit SP-API credentials to version control
- Use environment variables for sensitive configuration
- Consider rate limiting for production use
- Validate all user inputs on the backend

## Support

If you encounter issues:

1. Check the Flask server logs
2. Verify your SP-API credentials
3. Test with mock data first
4. Review the browser console for errors

The integration is designed to be modular and efficient, following your requirements for clean, working code. 
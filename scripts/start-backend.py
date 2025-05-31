import os
import time
import sys
import urllib3
from flask import Flask, request, jsonify
from flask_cors import CORS
from sp_api.api import CatalogItems, Products
from sp_api.base import Marketplaces
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Amazon SP-API credentials from environment variables
CREDENTIALS = {
    'refresh_token': os.getenv('AMAZON_REFRESH_TOKEN'),
    'lwa_app_id': os.getenv('AMAZON_LWA_APP_ID'), 
    'lwa_client_secret': os.getenv('AMAZON_LWA_CLIENT_SECRET'),
    'seller_id': os.getenv('AMAZON_SELLER_ID', 'A13NBKN6I076SR'),
}

# Validate that all required environment variables are set
required_vars = ['AMAZON_REFRESH_TOKEN', 'AMAZON_LWA_APP_ID', 'AMAZON_LWA_CLIENT_SECRET']
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
    logger.error("Please set the following environment variables:")
    for var in missing_vars:
        logger.error(f"  export {var}=your_value_here")
    exit(1)

# Flask Application 
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
urllib3.disable_warnings()  # Disable SSL warnings

# Initialize SP-API client
catalog_api = CatalogItems(credentials=CREDENTIALS, marketplace=Marketplaces.US)

def _extract_list_price(lp_val):
    """Extract list price value safely"""
    try:
        if hasattr(lp_val, 'amount'):
            return float(lp_val.amount)
        elif isinstance(lp_val, dict) and 'amount' in lp_val:
            return float(lp_val['amount'])
        return 0.0
    except (ValueError, AttributeError):
        return 0.0

@app.route('/api/amazon/search', methods=['POST'])
def search_amazon_products():
    try:
        data = request.get_json()
        user_input = data.get('query', '')
        search_type = data.get('type', 'keyword')
        
        if not user_input:
            return jsonify({'error': 'Query parameter is required'}), 400
            
        start_time = time.time()
        logger.info(f"=== STARTING SEARCH FOR: {user_input} (Type: {search_type}) ===")
        
        # Handle different search types
        if search_type == 'asin':
            logger.info(f"Performing ASIN search for: {user_input}")
            response = catalog_api.get_catalog_item(
                asin=user_input,
                marketplace_ids=[Marketplaces.US.marketplace_id],
                included_data=['attributes', 'images', 'productTypes', 'relationships', 'salesRanks']
            )
        elif search_type == 'upc':
            logger.info(f"Performing UPC search for: {user_input}")
            response = catalog_api.search_catalog_items(
                marketplace_ids=[Marketplaces.US.marketplace_id],
                identifiers=[user_input],
                identifiers_type='UPC',
                included_data=['attributes', 'images', 'productTypes', 'relationships', 'salesRanks'],
                page_size=20
            )
        else:  # keyword search
            logger.info(f"Performing keyword search for: {user_input}")
            response = catalog_api.search_catalog_items(
                marketplace_ids=[Marketplaces.US.marketplace_id],
                keywords=[user_input],
                included_data=['attributes', 'images', 'productTypes', 'relationships', 'salesRanks'],
                page_size=20
            )
        
        elapsed_time = time.time() - start_time
        logger.info(f"API response received in {elapsed_time:.2f} seconds")
        
        # Handle single item response (ASIN search)
        if search_type == 'asin' and hasattr(response, 'payload'):
            items = [response.payload] if response.payload else []
        elif hasattr(response, 'payload') and hasattr(response.payload, 'items'):
            items = response.payload.items
        else:
            items = []
            
        logger.info(f"Found {len(items)} potential items")
        
        # Process and format items
        formatted_items = []
        for item in items:
            try:
                # Extract basic information
                asin = getattr(item, 'asin', '')
                
                # Get attributes safely
                attributes = getattr(item, 'attributes', {}) or {}
                
                # Extract title
                title_attr = attributes.get('item_name') or attributes.get('title') 
                if hasattr(title_attr, '__iter__') and not isinstance(title_attr, str):
                    title = str(title_attr[0]) if title_attr else 'Unknown Product'
                else:
                    title = str(title_attr) if title_attr else 'Unknown Product'
                
                # Extract brand  
                brand_attr = attributes.get('brand')
                if hasattr(brand_attr, '__iter__') and not isinstance(brand_attr, str):
                    brand = str(brand_attr[0]) if brand_attr else ''
                else:
                    brand = str(brand_attr) if brand_attr else ''
                
                # Extract list price
                list_price_attr = attributes.get('list_price')
                list_price = 0.0
                if list_price_attr:
                    if hasattr(list_price_attr, '__iter__') and not isinstance(list_price_attr, str):
                        list_price = _extract_list_price(list_price_attr[0]) if list_price_attr else 0.0
                    else:
                        list_price = _extract_list_price(list_price_attr)
                
                # Extract image URL
                image_url = ''
                if hasattr(item, 'images') and item.images:
                    for image in item.images:
                        if hasattr(image, 'images') and image.images:
                            for img in image.images:
                                if hasattr(img, 'link'):
                                    image_url = img.link
                                    break
                            if image_url:
                                break
                
                # Extract product type/category
                category = ''
                if hasattr(item, 'product_types') and item.product_types:
                    category = str(item.product_types[0]) if item.product_types else ''
                
                formatted_item = {
                    'asin': asin,
                    'title': title,
                    'brand': brand,
                    'listPrice': list_price,
                    'imageUrl': image_url,
                    'category': category
                }
                
                formatted_items.append(formatted_item)
                
            except Exception as e:
                logger.error(f"Error processing item: {e}")
                continue
        
        elapsed_time = time.time() - start_time
        logger.info(f"Parsed {len(formatted_items)} valid products in {elapsed_time:.2f} seconds")
        logger.info(f"Returning items: {len(formatted_items)} found")
        
        return jsonify({'items': formatted_items})
        
    except Exception as e:
        logger.error(f"Error searching Amazon products: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/amazon/buybox/<asin>', methods=['GET'])
def get_buybox_price(asin):
    try:
        start_time = time.time()
        logger.info(f"Getting buybox and offers for ASIN: {asin}")
        products_api = Products(credentials=CREDENTIALS, marketplace=Marketplaces.US)
        
        # Initialize result with default values
        result = {
            'buybox_price': 0.0,
            'lowest_price': 0.0,
            'offers_count': 0
        }
        
        try:
            # Get competitive pricing
            pricing_response = products_api.get_competitive_pricing(
                asin_list=[asin],
                marketplace_id=Marketplaces.US.marketplace_id
            )
            
            if hasattr(pricing_response, 'payload') and pricing_response.payload:
                for pricing_data in pricing_response.payload:
                    if hasattr(pricing_data, 'competitive_pricing') and pricing_data.competitive_pricing:
                        competitive_pricing = pricing_data.competitive_pricing
                        
                        # Extract buybox price
                        if hasattr(competitive_pricing, 'competitive_prices') and competitive_pricing.competitive_prices:
                            for price_data in competitive_pricing.competitive_prices:
                                if (hasattr(price_data, 'condition') and 
                                    price_data.condition == 'New' and 
                                    hasattr(price_data, 'price') and 
                                    hasattr(price_data.price, 'listing_price') and
                                    hasattr(price_data.price.listing_price, 'amount')):
                                    result['buybox_price'] = float(price_data.price.listing_price.amount)
                                    break
            
        except Exception as e:
            logger.warning(f"Could not get competitive pricing for {asin}: {e}")
        
        elapsed_time = time.time() - start_time
        logger.info(f"Buybox lookup completed in {elapsed_time:.2f} seconds")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error getting buybox price for {asin}: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5002))
    debug = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    
    print(f"Starting Flask server on port {port}...")
    print("Using REAL SP-API with live Amazon data!")
    print("Make sure you have installed: pip install python-amazon-sp-api flask flask-cors")
    
    app.run(host='127.0.0.1', port=port, debug=debug) 
import { getApiBaseUrl } from '../../../config/api'

export async function GET() {
  try {
    console.log('=== PRODUCTS API PROXY CALLED ===')
    
    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/products/list/`
    
    console.log('Fetching products from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Don't include credentials for public product data
    })

    console.log('Products API response status:', response.status)
    console.log('Products API response ok:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Products API error response:', errorText)
      
      return Response.json(
        { 
          error: `Failed to fetch products: ${response.status} ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Products API response data:', data)
    console.log('Number of products:', Array.isArray(data) ? data.length : 'Not an array')

    return Response.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('=== PRODUCTS API PROXY ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)

    return Response.json(
      { 
        error: 'Internal server error while fetching products',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

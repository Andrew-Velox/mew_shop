import { getApiBaseUrl } from '../../../config/api'

export async function GET() {
  try {
    console.log('=== CATEGORIES API PROXY CALLED ===')
    
    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/products/category/`
    
    console.log('Fetching categories from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Don't include credentials for public category data
    })

    console.log('Categories API response status:', response.status)
    console.log('Categories API response ok:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Categories API error response:', errorText)
      
      return Response.json(
        { 
          error: `Failed to fetch categories: ${response.status} ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Categories API response data:', data)
    console.log('Number of categories:', Array.isArray(data) ? data.length : 'Not an array')

    return Response.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('=== CATEGORIES API PROXY ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)

    return Response.json(
      { 
        error: 'Internal server error while fetching categories',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

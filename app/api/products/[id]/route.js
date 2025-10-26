import { getApiBaseUrl } from '../../../../config/api'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    
    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/products/list/${id}/`
    
    console.log('Fetching product detail from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    console.log('Product detail API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Product detail API error:', errorText)
      
      return Response.json(
        { 
          error: `Failed to fetch product: ${response.status}`,
          details: errorText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Product detail fetched:', data)

    return Response.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('Product detail API error:', error)
    return Response.json(
      { 
        error: 'Failed to fetch product',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

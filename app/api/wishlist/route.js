import { getApiBaseUrl } from '../../../config/api'
import { cookies } from 'next/headers'

// Add to wishlist
export async function POST(request) {
  try {
    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return Response.json(
        { error: 'product_id is required' },
        { status: 400 }
      )
    }

    // Get auth token from cookies or headers
    const cookieStore = await cookies()
    let token = cookieStore.get('authToken')?.value
    
    // If not in cookies, check Authorization header (from localStorage)
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/wishlist/add/`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`  // Changed from Bearer to Token
      },
      body: JSON.stringify({ product_id })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: response.status })

  } catch (error) {
    console.error('Wishlist API Error:', error)
    return Response.json(
      { error: 'Failed to add to wishlist', message: error.message },
      { status: 500 }
    )
  }
}

// Get wishlist
export async function GET(request) {
  try {
    // Get auth token from cookies or headers
    const cookieStore = await cookies()
    let token = cookieStore.get('authToken')?.value
    
    // If not in cookies, check Authorization header (from localStorage)
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/wishlist/list/`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`  // Changed from Bearer to Token
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error('Get Wishlist API Error:', error)
    return Response.json(
      { error: 'Failed to get wishlist', message: error.message },
      { status: 500 }
    )
  }
}

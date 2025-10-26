import { getApiBaseUrl } from '../../../../config/api'
import { cookies } from 'next/headers'

// Remove from wishlist
export async function DELETE(request, { params }) {
  try {
    const { product_id } = await params

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
    const apiUrl = `${baseUrl}/wishlist/remove/${product_id}/`

    const response = await fetch(apiUrl, {
      method: 'DELETE',
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
    console.error('Remove from Wishlist API Error:', error)
    return Response.json(
      { error: 'Failed to remove from wishlist', message: error.message },
      { status: 500 }
    )
  }
}

// Check if product is in wishlist
export async function GET(request, { params }) {
  try {
    const { product_id } = await params

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
      return Response.json({ in_wishlist: false }, { status: 200 })
    }

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/wishlist/check/${product_id}/`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`  // Changed from Bearer to Token
      }
    })

    if (!response.ok) {
      return Response.json({ in_wishlist: false }, { status: 200 })
    }

    const data = await response.json()
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error('Check Wishlist API Error:', error)
    return Response.json({ in_wishlist: false }, { status: 200 })
  }
}

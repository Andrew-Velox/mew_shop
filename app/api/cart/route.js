import { getApiBaseUrl } from '../../../config/api'

// Add to cart
export async function POST(request) {
  try {
    const body = await request.json()
    const { cart_code, product_id, quantity } = body

    if (!cart_code || !product_id) {
      return Response.json(
        { error: 'cart_code and product_id are required' },
        { status: 400 }
      )
    }

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/cart/add/`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_code,
        product_id,
        quantity: quantity || 1
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error('Cart API Error:', error)
    return Response.json(
      { error: 'Failed to add to cart', message: error.message },
      { status: 500 }
    )
  }
}

// Get cart
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const cart_code = searchParams.get('cart_code')

    if (!cart_code) {
      return Response.json(
        { error: 'cart_code is required' },
        { status: 400 }
      )
    }

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/cart/get/${cart_code}/`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Return empty cart if not found
        return Response.json({
          cart_code,
          cartitems: [],
          cart_total: 0,
          total_items: 0
        }, { status: 200 })
      }
      const errorData = await response.json()
      return Response.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error('Get Cart API Error:', error)
    return Response.json(
      { error: 'Failed to get cart', message: error.message },
      { status: 500 }
    )
  }
}

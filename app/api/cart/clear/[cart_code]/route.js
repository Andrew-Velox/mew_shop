import { getApiBaseUrl } from '../../../../../config/api'

// Clear cart
export async function DELETE(request, { params }) {
  try {
    const { cart_code } = await params

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/cart/clear/${cart_code}/`

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error('Clear Cart API Error:', error)
    return Response.json(
      { error: 'Failed to clear cart', message: error.message },
      { status: 500 }
    )
  }
}

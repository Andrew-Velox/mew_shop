import { getApiBaseUrl } from '../../../../config/api'

// Update cart item quantity
export async function PATCH(request, { params }) {
  try {
    const { item_id } = await params
    const body = await request.json()
    const { quantity } = body

    if (quantity === undefined) {
      return Response.json(
        { error: 'quantity is required' },
        { status: 400 }
      )
    }

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/cart/update/${item_id}/`

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: 200 })

  } catch (error) {
    console.error('Update Cart Item API Error:', error)
    return Response.json(
      { error: 'Failed to update cart item', message: error.message },
      { status: 500 }
    )
  }
}

// Remove cart item
export async function DELETE(request, { params }) {
  try {
    const { item_id } = await params

    const baseUrl = getApiBaseUrl()
    const apiUrl = `${baseUrl}/cart/remove/${item_id}/`

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
    console.error('Remove Cart Item API Error:', error)
    return Response.json(
      { error: 'Failed to remove cart item', message: error.message },
      { status: 500 }
    )
  }
}

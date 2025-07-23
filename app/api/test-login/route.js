import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    console.log('Test login API called')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    // Mock the exact response your Django API returns
    const mockResponse = {
      "token": "5f9c8573d7ae9d7e74fa4169781380c8f3403604",
      "user": {
        "id": 13,
        "username": "vlx",
        "email": "andrewvelox1@gmail.com",
        "first_name": "Andrew",
        "last_name": "Velox",
        "is_active": true,
        "is_staff": false
      }
    }
    
    console.log('Returning mock response:', mockResponse)
    
    return NextResponse.json(mockResponse, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    })

  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json(
      { error: 'Test login failed' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    )
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

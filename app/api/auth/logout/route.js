import { NextResponse } from 'next/server'
import { getApiUrls, API_ENDPOINTS } from '../../../../config/api.js'

export async function GET(request) {
  try {
    console.log('Logout API called')
    
    // Get cookies from the request
    const cookies = request.headers.get('cookie') || ''
    
    // Get authorization header 
    const authHeader = request.headers.get('authorization') || ''
    
    // Get API URLs with fallback
    const API_URLS = getApiUrls(API_ENDPOINTS.LOGOUT)
    
    let djangoResponse
    let lastError
    
    for (const url of API_URLS) {
      try {
        console.log(`Trying Django logout API at: ${url}`)
        
        const headers = {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
          'Cookie': cookies, // Forward cookies to Django
        }
        
        // Add authorization header if available
        if (authHeader) {
          headers['Authorization'] = authHeader
          console.log('Adding authorization header for logout')
        }
        
        djangoResponse = await fetch(url, {
          method: 'GET',
          headers: headers,
          credentials: 'include',
        })
        
        // If we get any response (even error), consider it a successful connection
        if (djangoResponse) {
          console.log(`Connected to Django logout API at: ${url} (Status: ${djangoResponse.status})`)
          break
        }
      } catch (error) {
        console.log(`Failed to connect to ${url}:`, error.message)
        lastError = error
        continue
      }
    }
    
    // If no connection was successful
    if (!djangoResponse) {
      throw lastError || new Error('All Django API endpoints failed')
    }

    // Get the response data
    let responseData
    const contentType = djangoResponse.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await djangoResponse.json()
    } else {
      responseData = await djangoResponse.text()
    }

    console.log('Django logout response:', responseData)

    // Return the response with proper CORS headers
    const response = NextResponse.json(responseData, {
      status: djangoResponse.status,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    })

    // Forward Django cookies to the browser (for clearing them)
    const setCookieHeaders = djangoResponse.headers.getSetCookie()
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach(cookie => {
        response.headers.append('Set-Cookie', cookie)
      })
    }

    return response

  } catch (error) {
    console.error('Logout proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Django server for logout' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

import { NextResponse } from 'next/server'
import { getApiUrls, API_ENDPOINTS } from '../../../../config/api.js'

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json()
    
    // Get API URLs with fallback
    const API_URLS = getApiUrls(API_ENDPOINTS.LOGIN)
    
    let djangoResponse
    let lastError
    
    for (const url of API_URLS) {
      try {
        console.log(`Trying Django API at: ${url}`)
        
        djangoResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
          },
          credentials: 'include', // Include cookies
          body: JSON.stringify(body)
        })
        
        // If we get any response (even error), consider it a successful connection
        if (djangoResponse) {
          console.log(`Connected to Django API at: ${url} (Status: ${djangoResponse.status})`)
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

    // Check if Django returned an error in the response body (even with 200 status)
    if (typeof responseData === 'object' && responseData.error) {
      // Return 401 for authentication errors
      return NextResponse.json(responseData, {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Credentials': 'true',
        }
      })
    }

    // Return the response with proper CORS headers
    const response = NextResponse.json(responseData, {
      status: djangoResponse.status,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    })

    // Forward Django cookies to the browser
    const setCookieHeaders = djangoResponse.headers.getSetCookie()
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach(cookie => {
        response.headers.append('Set-Cookie', cookie)
      })
    }

    return response

  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Django server' },
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

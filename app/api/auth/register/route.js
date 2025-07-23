import { NextResponse } from 'next/server'
import { getApiUrls, API_ENDPOINTS } from '../../../../config/api.js'

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json()
    
    // Get API URLs with fallback
    const API_URLS = getApiUrls(API_ENDPOINTS.REGISTER)
    
    let djangoResponse
    let lastError
    
    for (const url of API_URLS) {
      try {
        console.log(`Trying Django register API at: ${url}`)
        
        djangoResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
        
        // If we get any response (even error), consider it a successful connection
        if (djangoResponse) {
          console.log(`Connected to Django register API at: ${url} (Status: ${djangoResponse.status})`)
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

    // Check if the response contains validation errors
    if (typeof responseData === 'object' && responseData !== null) {
      // If it's a JSON object, it's likely validation errors
      // Return with appropriate error status
      const hasErrors = Object.keys(responseData).some(key => 
        Array.isArray(responseData[key]) || typeof responseData[key] === 'string'
      )
      
      if (hasErrors) {
        return NextResponse.json(responseData, {
          status: 400, // Bad Request for validation errors
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        })
      }
    }

    // Return the response with proper CORS headers
    return NextResponse.json(responseData, {
      status: djangoResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Django server' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

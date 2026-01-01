import { NextRequest, NextResponse } from 'next/server'

const SPORTMONKS_API_TOKEN = process.env.SPORTMONKS_API_TOKEN || ''

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('🏏 Fetching team details for ID:', id)

    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    // Fetch team details with all includes
    const teamUrl = `http://72.60.107.98:8001/api/teams/${id}?api_token=${SPORTMONKS_API_TOKEN}&include=country,squad`
    console.log('📡 Fetching team from:', teamUrl.replace(SPORTMONKS_API_TOKEN, 'TOKEN'))
    
    const teamResponse = await fetch(teamUrl, {
      cache: 'no-store',
    })

    if (!teamResponse.ok) {
      console.error('❌ Team API error:', teamResponse.status)
      const errorText = await teamResponse.text()
      console.error('❌ Error response:', errorText)
      throw new Error(`Team API responded with status: ${teamResponse.status}`)
    }

    const teamData = await teamResponse.json()

    console.log('✅ Team data retrieved:', teamData.data?.name || 'Unknown')

    return NextResponse.json(teamData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching team details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team details' },
      { status: 500 }
    )
  }
}

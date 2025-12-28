import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Extract id from query parameter

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, error: 'ID is required' }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    const propertyId = process.env.GOOGLE_PROPERTY_ID;
    const pagePath = `/stock/${id}`; // Assuming page path format

    // Fetch engagement metrics
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'averageSessionDuration' }, // Avg time on page
        { name: 'bounceRate' }, // Bounce rate
        { name: 'eventCount' }, // Scroll depth (assuming event-based tracking)
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            value: pagePath,
            matchType: 'EXACT',
          },
        },
      },
    });

    // Transform the data
    const data = response.rows.map((row) => ({
      date: row.dimensionValues[0]?.value || 'unknown',
      avgTimeOnPage: Number(row.metricValues[0]?.value || 0),
      bounceRate: Number(row.metricValues[1]?.value || 0),
      scrollDepth: Number(row.metricValues[2]?.value || 0),
    }));

    const result = {
      page: pagePath,
      data,
    };

    console.log('Engagement Metrics:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Google Analytics API Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

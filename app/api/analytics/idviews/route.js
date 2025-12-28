import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');  // Extract id from query parameter

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
    const pagePath = `/stock/${id}`;  // Assuming page path is formatted like "/stock/[id]"

    // Run the GA4 report filtered by the specific page path
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      dimensions: [
        { name: 'date' },
        { name: 'pagePath' }
      ],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',  // Specify the field name here
          stringFilter: {
            value: pagePath,
            matchType: 'EXACT',
          },
        },
      },
    });

    // Extract and format the data
    const data = response.rows.map((row) => ({
      date: row.dimensionValues[0]?.value || 'unknown',
      pageViews: Number(row.metricValues[0]?.value || 0),
    }));

    const result = {
      page: pagePath,
      data,
    };

    console.log('Formatted Page Views Data:', JSON.stringify(result, null, 2));

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

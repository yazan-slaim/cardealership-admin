import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET(request) {
  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    const propertyId = process.env.GOOGLE_PROPERTY_ID;

    // Fetch gender and age data
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'userGender' }, { name: 'userAgeBracket' }],
      metrics: [{ name: 'activeUsers' }],
    });

    let genderData = {};
    let ageData = {};

    response.rows.forEach((row) => {
      const gender = row.dimensionValues[0]?.value || 'Unknown';
      const ageGroup = row.dimensionValues[1]?.value || 'Unknown';
      const users = Number(row.metricValues[0]?.value || 0);

      // Count users by gender
      genderData[gender] = (genderData[gender] || 0) + users;

      // Count users by age group
      ageData[ageGroup] = (ageData[ageGroup] || 0) + users;
    });

    return new Response(
      JSON.stringify({
        success: true,
        genderData,
        ageData,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Google Analytics API Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

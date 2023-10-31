import https from 'https';

export const handler = async (event, context) => {
  try {
    const cm = event.queryStringParameters.cm;
    
    const options = {
        hostname: 'www.meteomedia.com',
        path: `/api/data/${cm}/cm?_guid_iss_=1`,
        protocol: "https:",
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        },
    }
    
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        }));
      });

      req.on('error', (error) => reject(error));
      if (event.body) {
        req.write(event.body);
      }
      req.end();
    });

    return response;
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

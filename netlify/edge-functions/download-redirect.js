export default async (request, context) => {
  console.log("Edge function invoked for:", request.url);
  const userAgent = request.headers.get('user-agent') || '';
  console.log("User-Agent:", userAgent);
  
  return new Response("EDGE FUNCTION HIT - Testing", { 
    status: 200, 
    headers: { 
      "content-type": "text/plain",
      "x-edge-test": "1" 
    } 
  });
};

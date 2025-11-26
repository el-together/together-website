export default async (request, context) => {
  const userAgent = request.headers.get('user-agent') || '';
  
  const iosAppStoreUrl = 'https://apps.apple.com/es/app/together-daily-to-do-planner/id6460859044';
  const androidPlayStoreUrl = 'https://play.google.com/store/apps/details?id=day.together.app';
  
  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return Response.redirect(iosAppStoreUrl, 302);
  }
  
  if (/android/i.test(userAgent)) {
    return Response.redirect(androidPlayStoreUrl, 302);
  }
  
  return context.next();
};

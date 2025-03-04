export function onRequest(context) {
    const adminKey = context.request.headers.get('Admin-Key');
    if (!adminKey)
        return new Response(JSON.stringify({ success:false, error_code: 111, description:'Lack of admin key' }))
    if (adminKey !== context.env.accessKey)
        return new Response(JSON.stringify({ success:false, error_code: 112, description:'Error admin key' }))
    return context.next()
}

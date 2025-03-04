export function onRequest(context) {
    const adminKey = context.headers.get('Admin-Key');
    if (!adminKey)
        return Response(JSON.stringify({ success:false, error_code: 111, description:'Lack of admin key' }))
    if (adminKey !== context.env.accessKey)
        return Response(JSON.stringify({ success:false, error_code: 112, description:'Error admin key' }))
    context.next()
}

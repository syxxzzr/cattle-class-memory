export function onRequest(context) {
    const assessKey = context.headers.get('Assess-Key');
    if (!assessKey)
        return Response(JSON.stringify({ success:false, error_code: 101, description:'Lack of assess key' }))
    if (assessKey !== context.env.accessKey)
        return Response(JSON.stringify({ success:false, error_code: 102, description:'Error assess key' }))
    context.next()
}

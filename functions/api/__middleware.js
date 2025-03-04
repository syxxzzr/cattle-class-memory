export function onRequestPost(context) {
    const { request, env, params, waitUntil, next, data } = context;
    if (context.request.method !== 'POST')
        return Response('Method not allowed', { status: 405 });
    if (['accessKey', 'adminKey', 'tgBotToken', 'tgChannelID'].every(key => context.env.hasOwnProperty(key)))
        return Response('Server running lack of necessary configs', { status: 503 });
    context.next()
}

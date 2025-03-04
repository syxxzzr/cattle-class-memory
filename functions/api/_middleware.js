export function onRequest(context) {
    const { request, env, params, waitUntil, next, data } = context;
    if (context.request.method !== 'POST')
        return new Response('Method not allowed', { status: 405 });
    if (!['accessKey', 'adminKey', 'tgBotToken', 'tgChannelID'].every(key => context.env.hasOwnProperty(key)))
        return new Response('Server running lack of necessary configs', { status: 503 });
    return context.next()
}

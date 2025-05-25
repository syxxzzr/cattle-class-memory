export function onRequest(context) {
    if (!['accessKey', 'adminKey', 'tgBotToken', 'tgChannelID', 'KVSpace', 'projectName', 'projectDescription'].every(key => context.env.hasOwnProperty(key)))
        return new Response(Response(JSON.stringify({
            ok: false,
            error_code: 400,
            description: 'Bad Request: server running without necessary configs'
        }), { status: 400 }));
    return context.next();
}

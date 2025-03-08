export async function onRequest(context) {
    const { env } = context;
    let keyList = [];
    let keyData = { list_complete: false, cursor: undefined };
    try {
        while (keyData.list_complete) {
            keyData = await env.KVSpace.list({ cursor: keyData.cursor });
            keyList = keyList.concat(keyData.keys);
        }
    } catch (err) {
        return new Response(JSON.stringify({
            ok: false,
            error_code: 400,
            description: 'Bad Request: failed to record in KV space'
        }), { headers: { 'Content-Type': 'application/json' }, status: 400 });
    }
    keyList = keyList.map(value => value.metadata);
    return new Response(JSON.stringify({
        ok: true,
        result: keyList
    }), { headers: { 'Content-Type': 'application/json' } });
}

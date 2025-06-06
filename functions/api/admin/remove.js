export async function onRequest(context) {
    const { request, env } = context;
    const formData = await request.formData();
    const identifier = formData.get('identifier');
    try {
        await env.KVSpace.delete(identifier);
    } catch (err) {
        return new Response(JSON.stringify({
            ok: false,
            error_code: 400,
            description: 'Bad Request: failed to record in KV space'
        }), { headers: { 'Content-Type': 'application/json' }, status: 400 });
    }
    return new Response(JSON.stringify({
        ok: true
    }), { headers: { 'Content-Type': 'application/json' } });
}

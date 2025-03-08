export async function onRequest(context) {
    const { request, env } = context;
    const tgBotToken = env.tgBotToken;
    const tgChannelID = env.tgChannelID;

    const formData = await request.formData();
    const file = formData.get('file');
    const fileTitle = formData.get('file_title') || 'New File';
    const description = formData.get('description') || 'No Description';

    const form = new FormData();
    form.append('chat_id', tgChannelID);
    form.append('photo', file);
    form.append('disable_notification', true.toString());
    try {
        const response = await fetch(`https://api.telegram.org/bot${tgBotToken}/sendPhoto`, {
            method: 'POST',
            body: form
        });
        if (!response.ok)
            return response;
        const responseData = await response.json();
        var fileData = responseData.result.photo.pop();
    } catch (err) {
        return new Response(JSON.stringify({
            ok: false,
            error_code: 400,
            description: 'Bad Request: cannot correctly fetch telegram bot api'
        }), { headers: { 'Content-Type': 'application/json' }, status: 400 });
    }
    try {
        await env.KVSpace.put(fileData['file_id'], '', {
            metadata: {
                file_title: fileTitle,
                file_description: description,
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            ok: false,
            error_code: 400,
            description: 'Bad Request: failed to record in KV space'
        }), { headers: { 'Content-Type': 'application/json' }, status: 400 });
    }
    return new Response(JSON.stringify({
        ok: true,
        result: {
            file_id: fileData['file_id'],
            file_size: fileData['file_size'],
            width: fileData['width'],
            height: fileData['height']}
    }), { headers: { 'Content-Type': 'application/json' } });
}

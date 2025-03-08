export async function onRequest(context) {
    const { env, params } = context;
    const tgBotToken = env.tgBotToken;

    const fileId = decodeURIComponent(params.fileId);

    try {
        const response = await fetch(`https://api.telegram.org/bot${tgBotToken}/getFile?file_id=${fileId}`, {
            method: 'POST'
        });
        if (!response.ok)
            return response;
        var responseData = await response.json();
    } catch (error) {
        return new Response(JSON.stringify({
            ok: false,
            error_code: 400,
            description: 'Bad Request: cannot correctly fetch telegram bot api'
        }), { headers: { 'Content-Type': 'application/json' }, status: 400 });
    }
    const filePath = responseData.result.file_path;
    for (let i = 0; i < 5; i++)
        try {
            const fileResponse = await fetch(`https://api.telegram.org/file/bot${tgBotToken}/${filePath}`, {
                method: 'GET'
            });
            if (fileResponse.ok || fileResponse.status === 304 || fileResponse.status === 404)
                return fileResponse;
        } catch (error) {}
    return new Response(JSON.stringify({
        ok: false,
        error_code: 400,
        description: 'Bad Request: cannot correctly fetch file from telegram server'
    }), { headers: { 'Content-Type': 'application/json' }, status: 400 });
}

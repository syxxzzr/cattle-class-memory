import { Api, InputFile } from "grammy";

export async function onRequest(context) {
    const { request, env, params, waitUntil, next, data } = context;
    const tgBotToken = env.tgBotToken;
    const tgChannelID = env.tgChannelID;

    const formData = await request.formData();
    const file = formData.get('file');
    const fileName = file.name
    const fileExt = fileName.split('.').pop();
    const description = formData.get('description') || '';

    const botApi = new Api(tgBotToken);
    const response = await botApi.sendPhoto(tgChannelID, new InputFile(file), {caption: `${crypto.randomUUID()}.${fileExt}`});
    await botApi.sendMessage(tgChannelID, `${fileName}:${description}`);
    return Response(response.photo);
}

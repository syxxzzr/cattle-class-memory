import {auth} from "../../utils.js";

export function onRequest(context) {
    const assessKey = context.request.headers.get('Assess-Key');
    let { ok, errResponse } = auth(assessKey, context.env.accessKey);
    if (!ok)
        return errResponse;
    return context.next();
}

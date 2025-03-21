import {auth} from "../../utils.js";

export function onRequest(context) {
    const assessKey = context.request.headers.get('Access-Key');
    let { ok } = auth(assessKey, context.env.accessKey);
    if (!ok) {
        const adminKey = context.request.headers.get('Admin-Key');
        let { ok, errResponse } = auth(adminKey, context.env.adminKey);
        if (!ok)
            return errResponse;
    }
    return context.next();
}

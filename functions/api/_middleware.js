import {methodCheck} from "../utils.js";

export function onRequest(context) {
    let { ok, errResponse } = methodCheck(context.request.method, 'POST');
    if (!ok)
        return errResponse;
    return context.next();
}

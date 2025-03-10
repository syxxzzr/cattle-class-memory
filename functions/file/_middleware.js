import { methodCheck } from "../utils.js";

export function onRequest(context) {
    let {ok, errResponse} = methodCheck(context.request.method, 'GET');
    if (!ok)
        return errResponse;
    return context.next();
}

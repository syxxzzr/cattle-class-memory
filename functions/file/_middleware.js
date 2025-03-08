import { auth, methodCheck } from "../utils.js";

export function onRequest(context) {
    {
        let {ok, errResponse} = methodCheck(context.request.method, 'GET');
        if (!ok)
            return errResponse;
    }
    const assessKey = context.request.headers.get('Assess-Key');
    let { ok, errResponse } = auth(assessKey, context.env.accessKey);
    if (!ok)
        return errResponse;
    return context.next();
}

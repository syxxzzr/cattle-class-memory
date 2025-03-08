import md5 from 'md5'

export function auth(key, authKey) {
    let hint = undefined;
    if (!key)
        hint = 'lack of pass key'
    else if (key !== md5(authKey))
        hint = 'error pass key';
    return {
        ok: !hint,
        errResponse: new Response(JSON.stringify({
            ok: false,
            error_code: 401,
            description: `Unauthorized: ${hint}`
        }), { headers: { 'Content-Type': 'application/json' }, status: 401 })
    }
}

export function methodCheck(method, allowedMethod) {
    if (allowedMethod instanceof String)
        allowedMethod = [ allowedMethod ];
    return {
        ok: allowedMethod.includes(method),
        errResponse: new Response(JSON.stringify({
            ok: false,
            error_code: 405,
            description: 'Method not allowed'
        }), { status: 405 })
    }
}

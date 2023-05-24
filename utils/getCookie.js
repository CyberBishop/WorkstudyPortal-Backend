function getCookie({ name, headers }) {
    const cookieHeader = headers.cookie;
    if (!cookieHeader) {
        return undefined;
    }

    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }

    return undefined;
}

module.exports = getCookie;

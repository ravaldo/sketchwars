let _api_url = ''
let _socket_url = '';

if (process.env.NODE_ENV === "production") {
    _api_url    = process.env.REACT_APP_BACKEND_API_URL
    _socket_url = process.env.REACT_APP_BACKEND_SOCKET_URL
}

// assume the backend is running on the same domain as the react app at port 9000
else {
    const { protocol, host } = window.location;
    const domain = host.replace(/:\d{4}$/, "");
    _api_url    = `${protocol}//${domain}:9000`;
    _socket_url = `${protocol === "https:" ? "wss" : "ws"}://${domain}:9000`;
}

export const api_url = _api_url;
export const socket_url = _socket_url;

const constants = {
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri:
        process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:3000/authorization_callback"
            : "https://composer.goessl.me/authorization_callback",
    scopes: encodeURIComponent("playlist-read-private playlist-modify-public playlist-read-collaborative user-library-read"),
    code_challenge_method: "S256",
}

export default constants

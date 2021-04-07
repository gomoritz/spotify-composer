const constants = {
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    response_type: "token",
    redirect_uri: process.env.NODE_ENV === "development" ?
        "http://localhost:3000/authorization_callback" :
        "https://composer.incxption.dev/authorization_callback",
    scopes: encodeURIComponent("playlist-read-private playlist-modify-public playlist-read-collaborative user-library-read")
}

export default constants
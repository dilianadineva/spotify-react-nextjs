import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, {LOGIN_URL} from "../../../lib/spotify"

async function refreshAccessToken(token) {

  try {
    spotifyApi.setAccessToken(token)
    spotifyApi.setRefreshToken(token)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    console.log("refreshed token is: ", refreshedToken)

    return {
      ...token, 
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, //expires in 1 hour
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken //if the api returned a refreshedToken.refresh_token - use it, otherwise use token.refreshToken
    }

  } catch (err) {
    console.log(err)
    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }

}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({
      token,
      account,
      user
    }) {

      //initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000
        }
      }

      //Return previous token if the access token hasn't expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("access token still valid")
        return token
      } 
        //Access token has expired
        console.log("access token expired")
        //our own funtion
        return await refreshAccessToken(token)
    },
    async session({session, token}){
      //create a session object
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username

      return session
    }
  }
})
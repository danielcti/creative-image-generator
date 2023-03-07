import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "/user/get_by_email?email=" +
          user.email
      );
      const data = await response.json();
      if (data) {
        return true;
      } else {
        await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/user", {
          method: "POST",
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            avatarUrl: user.image,
          }),
        });
        return true;
      }
    },
  },
};

export default NextAuth(authOptions);

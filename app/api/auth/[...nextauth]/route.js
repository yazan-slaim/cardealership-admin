import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { Employee } from "@/models/Employee";
import { connectMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs"; // bcrypt needs Node runtime

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        try {
          await connectMongoDB();
          const email = (credentials?.email || "").toLowerCase().trim();
          const pass = credentials?.password || "";

          const emp = await Employee.findOne({ email });
          if (!emp || !emp.isActive) return null;

          const hash = emp.passwordHash || "";

          const isBcrypt =
            typeof hash === "string" &&
            /^\$2[aby]\$/.test(hash) &&
            hash.length >= 50;

          let ok = false;

          if (isBcrypt) {
            // normal path
            ok = await bcrypt.compare(pass, hash);
          } else {
            // legacy plaintext (or other legacy format) — compare directly once
            ok = pass === hash;
            if (ok) {
              // re-hash and save so next login uses bcrypt
              emp.passwordHash = await bcrypt.hash(pass, 10);
              await emp.save();
            }
          }

          if (!ok) return null;

          return {
            id: emp._id.toString(),
            email: emp.email,
            name: emp.fullName || "",
            image: emp.profileImageUrl || null,
            role: emp.role || "agent",
          };
        } catch (e) {
          console.error("authorize error:", e);
          return null; // avoid throwing to NextAuth
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        await connectMongoDB();
        const email = profile?.email && profile.email.toLowerCase().trim();
        if (!email) return false;

        let emp = await Employee.findOne({ email });
        if (!emp) {
          const randomPass = crypto.randomBytes(32).toString("hex");
          const passwordHash = await bcrypt.hash(randomPass, 10);

          emp = await Employee.create({
            fullName: profile?.name || "GitHub User",
            email,
            passwordHash,
            profileImageUrl: profile?.avatar_url || null,
            role: "agent",
            isActive: true,
          });
        }

        return {
          id: emp._id.toString(),
          email: emp.email,
          name: emp.fullName,
          image: emp.profileImageUrl,
          role: emp.role,
        };
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;

        if (token.id && process.env.JWT_SECRET) {
          const apiToken = jwt.sign({ id: token.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          session.user.apiToken = apiToken;
        }
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);

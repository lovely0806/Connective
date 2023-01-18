import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
const mysql = require("mysql2");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var bcrypt = require("bcryptjs");

export default (req, res) =>
  NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: "connective",
    callbacks: {
      async signIn({ account, profile }) {
        if (account.provider != "google") return false;

        const name = profile.name;
        const email = profile.email;
        const accessToken = account.access_token;

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(accessToken, salt);

        const connection = mysql.createConnection(process.env.DATABASE_URL);
        const [results, fields, err] = await connection
          .promise()
          .query(`SELECT * FROM Users WHERE email='${email}';`);

        if (results.length) {
          if (results[0].is_signup_with_google) {
            await connection
              .promise()
              .query(
                `UPDATE Users SET password_hash='${hash}' WHERE email='${email}';`
              );
          } else {
            return `/auth/signin?error=true`;
          }
        } else {
          const stripe_account = await stripe.accounts.create({
            type: "express",
          });
          await connection
            .promise()
            .execute(
              `INSERT INTO Users (username, password_hash, email, email_verified, stripeID, is_signup_with_google) VALUES ('${name}', '${hash}', '${email}', true,'${stripe_account.id}', true);`
            );
        }

        return `/auth/signin?token=${accessToken}&email=${email}`;
      },
    },
  });

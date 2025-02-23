import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import ViteExpress from "vite-express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import session from "express-session";

const PORT = process.env.PORT || 5173;

main();

function main() {
  const app = express();

  app.use(session({ secret: "nta", resave: false, saveUninitialized: false }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user as never));
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${process.env.HOSTNAME}/auth/github/callback`,
      },
      // @ts-ignore
      (accessToken, refreshToken, profile, done) => {
        if (profile.id !== "17786588") {
          return done(null, false, { message: "Incorrect GitHub ID" });
        }
        return done(null, profile);
      }
    )
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/auth/github", passport.authenticate("github", { scope: [] }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.get("/login", (_, res) => {
    res.send(`
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          background-color: #171717;
        }
      </style>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
        <img src="/nta-icon.png" width="256" height="256" style="margin-bottom: 20px;"/>
        <a 
          href="/auth/github" 
          style="
            background-color:rgb(35, 35, 35);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px;
            margin: 4px 2px;
            cursor: pointer;
            text-decoration: none;
            font-size: 16px;
          "
        >
          Login
        </a>
      </div>
    `);
  });

  app.use(ViteExpress.static());

  app.use(ensureAuthenticated);

  app.get("/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  app.get("/hello", (_, res) => {
    res.send("Hello from express");
  });

  const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });

  ViteExpress.bind(app, server);
}

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

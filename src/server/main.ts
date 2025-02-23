import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import ViteExpress from "vite-express";
import Passport from "passport";
import GitHubAuth from "passport-github2";

const PORT = process.env.PORT || 5173;
const HOSTNAME = process.env.HOSTNAME!;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

main();

function main() {
  const app = express();

  if (process.env.NO_AUTH !== "true") {
    setupAuth(app);
  }

  app.get("/api/hello", (_, res) => {
    res.send("Hello from the server!");
  });

  ViteExpress.listen(app, +PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

function setupAuth(app: express.Express) {
  app.use(session({ secret: "nta", resave: false, saveUninitialized: false }));

  Passport.serializeUser((user, done) => done(null, user));
  Passport.deserializeUser((user, done) => done(null, user as never));
  Passport.use(
    new GitHubAuth.Strategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${HOSTNAME}/auth/github/callback`,
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
  app.use(Passport.initialize());
  app.use(Passport.session());

  app.get("/auth/github", Passport.authenticate("github", { scope: [] }));
  app.get(
    "/auth/github/callback",
    Passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
    })
  );

  app.get("/auth/login", (_, res) => {
    res.sendFile("public/login.html", { root: process.cwd() });
  });

  // serve static files before checking authentication
  app.use(ViteExpress.static());

  app.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/auth/login");
    }

    return next();
  });

  app.get("/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

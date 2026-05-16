import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/user.model.js";

passport.use(

    new GoogleStrategy(
        {
            clientID:
            process.env.GOOGLE_CLIENT_ID,

            clientSecret:
                process.env.GOOGLE_CLIENT_SECRET,

            callbackURL:
                process.env.GOOGLE_CALLBACK_URL
        },

        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {

            try {

                console.log("in pass.js");
                
                /**
                 * GET EMAIL
                 */
                const email =
                profile.emails[0].value;

                /**
                 * CHECK USER
                 */
                let user =
                await User.findOne({ email });

                /**
                 * REGISTER
                 */
                if (!user) {

                user =
                    await User.create({
                        name: profile.displayName,
                        email,
                        provider: "google"
                    });
                }

                /**
                 * LOGIN SUCCESS
                 */
                return done(null, user);

            } catch (err) {

                return done(err, null);
            }
        }
    )
);

export default passport;
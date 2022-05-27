var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var mongoose = require('mongoose');

module.exports = function () {
   var Usuario = mongoose.model('Usuario');

   passport.use(
      new GitHubStrategy(
         {
            // HEROKU
            clientID: 'b0ee32010650c88266d0',
            clientSecret: '45bd882368da4d7af71e2d3238850ea62f8d29e1',
            callbackURL:
               'https://dswa5-14-ac-pt3009696.herokuapp.com/auth/github/callback',

            // LOCAL
            // clientID: '0585210c8aad190da48c',
            // clientSecret: 'b3d1f2938a7a77f303f2f15e75e822193def4ddf',
            // callbackURL: 'http://localhost:3000/auth/github/callback',
         },
         function (accessToken, refreshToken, profile, done) {
            Usuario.findOrCreate(
               { login: profile.username },
               { nome: profile.username },
               function (erro, usuario) {
                  if (erro) {
                     console.log(erro);
                     return done(erro);
                  }
                  return done(null, usuario);
               }
            );
         }
      )
   );

   passport.serializeUser(function (usuario, done) {
      done(null, usuario._id);
   });

   passport.deserializeUser(function (id, done) {
      Usuario.findById(id)
         .exec()
         .then(function (usuario) {
            done(null, usuario);
         });
   });
};

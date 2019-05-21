'use strict';

const app = require('express')();
const simpleOauthModule = require('simple-oauth2');
const port = Number(process.env.PORT || '8080');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_HOST = process.env.TOKEN_HOST;
const SCHEME = process.env.SCHEME || 'http';
const HOST = process.env.HOST || 'localhost:8080';
const REDIRECT_URI = SCHEME + '://' + HOST + '/callback';

const createApplication = (cb) => {
  app.listen(port, (err) => {
    if (err) return console.error(err);
    console.log(`Express server listening at http://localhost:${port}`);
    cb({ app });
  });
};

createApplication(({ app }) => {
  const oauth2 = simpleOauthModule.create({
    client: {
      id: CLIENT_ID,
      secret: CLIENT_SECRET
    },
    auth: {
      tokenHost: TOKEN_HOST,
      tokenPath: '/oauth2/token',
      authorizePath: '/oauth2/auth'
    }
  });

  // Authorization uri definition
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: REDIRECT_URI,
    scope: 'openid offline',
    state: '3(#0/!~]'
  });

  // Initial page redirecting to Increase
  app.get('/auth', (_req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const options = {
      code,
      redirect_uri: REDIRECT_URI,
      scope: 'openid offline'
    };

    try {
      const result = await oauth2.authorizationCode.getToken(options);
      console.log('The resulting token: ', result);
      const token = oauth2.accessToken.create(result);

      return res.status(200).json(token);
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  app.get('/', (_req, res) => {
    res.send('<a href="/auth">Conectar con Increase</a>');
  });
});

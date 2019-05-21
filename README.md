In order to execute this test you need to have Docker running
Then:
1)Clone the repository
2)Go to "test-oauth2-client-server" folder and Execute in console: docker build . -t terceros-test
3)Execute in console: docker run --rm -e CLIENT_ID= <YOUR-CLIENT-ID> -e CLIENT_SECRET=< YOUR-CLIENT-SECRET> -e TOKEN_HOST=https://oauth.increase.app -p 8080:8080 terceros-test`
4)Now you have your localhost server running, so you can open your browser and open http://localhost:8080/ and complete the flow.


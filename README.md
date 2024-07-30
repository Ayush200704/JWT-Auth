# JWT Auth
## How to Run the Code
First, run the server.js 
write npm run dev

Second, open AuthServer.js file and run it
write npm run dev2

## Go to Postman

### localhost:3000/register
go to body and select json
write the username and password
and hit run

### localhost:3000/login
go to body and select json
write the same username and password
and hit run
you will get access_token and refresh_token
copy the access_token

### localhost:5555
it is the protected route so
go to Auth and select bearer
and paste the access_token 
and hit run

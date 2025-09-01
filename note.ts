// 1. user
// 2. auth
// 3. otp
// 4. analitics
// 5. project
// 6. labour
// 7. quote
// 8. interim
// 9. labor expense
// 10. material expense
// 11. sub contractor


// 12. live project cost
// 13. site picture and reports
// 14. note
// 15. certificate
// 16. documents
// 17. handover tool
// 18. time scheduling
// 19. snagging list
// 20. setting
// 21. notification
// 22. profile management
// etc.
// ======================================

// dockerfile starting

// FROM node:22  AS builder
// # RUN apk add --no-cache python3 make g++ 
// WORKDIR /app

// COPY package.json  ./

// # RUN yarn cache clean
// RUN npm cache clean --force

// # RUN yarn install --frozen-lockfile
// # RUN npm install --production
// RUN npm install

// COPY . .

// # RUN yarn build
// RUN npm run build

// FROM node:22 

// WORKDIR /app

// # Copy package.json is required for npm to run
// COPY --from=builder /app/package.json ./

// COPY --from=builder /app/node_modules ./node_modules
// COPY --from=builder /app/dist ./dist

// EXPOSE 5001

// CMD ["npm","run", "start:prod"]

// dockerfile ending
// =====================================

// docker compose file starting
// version: '3.8'

// services:
//   backend:
//     build:
//       context: .
//       dockerfile: Dockerfile
//     ports:
//       - "5001:5001" # Match the PORT from your .env file
//     volumes:
//       - .:/app
//       - /app/node_modules
//     env_file:
//       - .env # Specify your .env file
//     command: npm run start:dev # Or your relevant start script

// docker compose file ending
// ======================================
// -----BEGIN RSA PRIVATE KEY-----
// MIIEowIBAAKCAQEArVVSDmA1nfkuzuh0Qtv1MWJVqEJWF1xPgJjH/rCLMyjGI06I
// xT/hkKBu/RIx4Vu0cjQLvxsEsTR3JUdbg1qd0Tpl+iaBm5NYvia9Z+JqU/GuZ3/+
// MivnMJeI8uMQnfHyyJOM7piA8YiENFobpWLXrRdnkjyWduHAbiwb3S0A1yLrnpEr
// cVRGr1SE9wBfGaMwDoYTOAu+nLZBxLt7uHBrnO3T0G9UqiB7nCnUCyFZt4NadaWp
// KvFpRUJYgdZmej/WFZDdUxuaGSlDA/aYq3uggkj6TsiFSWYxqEV9HosOc3Dndvga
// Xn92PxzpUhrT4CvRnFRJeeDKUFBVw6ZFRBzUtwIDAQABAoIBAA17CkO19dWQcLSE
// 3a3pf3tUw4avihSNCF3fBAbp4hmbfTV3wSleG4PtBlTGWnzFbhZHt/Yn+shxZSbQ
// Euz3WjjQiufWoNPhtNAtISP4Nv7KWB8SlEmAop1j27HQORWfoJs65oYT9EtUq7uK
// moXVVyLOJC76aVVbn2SyJ4SfIGaa3s/4r9A4qDcNMDpVZjNHvA0wZiXUei3OreUq
// rSQla9T6fqVsMITRCCL5hKwW7eRUaUZm1b3KbrrrhVuSl9za4R8/Y/pZGg7uJk6b
// yj2+BfEKSVGIXfH2I76NzROxiR6Aecyf+R+ulzeGV9/IjOyNcNI258311zXm3L5x
// MxYO55kCgYEA4o6lzHBvjuVxfFIlKPUfiSO8x/mvZ5+A1N4Exz1Y9OA25zvSJdnr
// R7cU8qmJgQDULV6dY7w7XEJ0uVE/JmkSgZyKmrjwb1QZK+L9XvHCkaeH1thojYfU
// j0DJMCswvA1oDsNhzBGkVPdKOpTGesbymCKFp9dx7FmpSTqXqs64zw0CgYEAw9v2
// B52S4ONH327IMwt0d5vCPtOMtOWPPmZoo5BPEI7kcolSTKWjmdpACrySX3S5CksC
// o4Ybh9hZljHZU0fvmpTS3jbeWgfNYPj9M2uos0o+bvXp3QUEg+HogU+jAfxHnQdG
// QkNtivMQcKeCnttTxm0dIhFzE9F7XtcCkqkfodMCgYA721pcuDwRMfeY1A8zUggB
// 8Ko433QDWbXtB7eVeFTfZbm7wCdWjsvFx85GCprktXZZgkztA9dfGcPDDn8zw8D6
// 84P/OutzTnHUEYXFpvQ0DWIrVkPRWNjE/GXrTw3yMUyT0fUtuF+Ff0xiS9pgp92C
// amSLorVbr5i1W0ClBTb4pQKBgQCrYVOdQlJ9miMP7Z4cnE9jQdXsp6wdtilrjqzN
// Qr8MXByl5GcxTlcjjwgu3OavxDEOQqiicfyxF6z8cc4aw31zo/oIG7bgzKb3zaex
// UOkjSTnsWh4zGerjg8+xJwAaAqifTPg7j0jRJvMhwFHZs01Q+bVeVCqAEvOC/1zu
// /DIDpQKBgFvXvkVaetfEwoIJWzwpSiiVMH24vG3KZLIn1tuxEuFxVUJhlsqsmDhX
// 3a+KpptdUTR2rOUGtzwcfPa4g0Q9vaBTFHaIrY48hgavVaARcxiMhjamp5lOxEIL
// 3DSQlN63absj4bGYpQapCK1OypFj8GskQLxyGg3xUn1RGCnpp9EL
// -----END RSA PRIVATE KEY-----
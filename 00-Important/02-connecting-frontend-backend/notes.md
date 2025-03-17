# Motive
- know what is CORS issue ? how to resolve it ?
- stand for `Cross-Origin Resource Sharing` mainly use for enforce security in development 
- our backend server is running on `http://localhost:8000/` and our frontend is running on `http://localhost:5173/`
- CORS restricting us to make request in our backend server due to domain mismatch (here just port)
- CORS policy restricts web pages from making requests to a different domain than the one that served the original web page

- solve at backend 
- we can solve it backend by using CORS package `app.use(cors())` adding this line before our routes Enable All CORS Requests so anyone can make request on our serve resulting high cost 
- we can do url whitelisting , allow only our urls 

- solve at frontend
- by using proxy in vite
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000/" , // <-  backend url
    }
  }
})

```
- now when ever i use `/api` for fetching data it will treat as `http://localhost:8000/`




- for fetching data this project use axios package for easy data fetching
```js
axios
    .get("api/jokes")
    .then((res) => {
      setjokes(res.data);
    })
    .catch((rej) => {
      console.error(rej);
    });
```
- we can use normal fetch or react query etc 
- axios is easy way to make fetch request , with pre built methods / class
```js
fetch("api/jokes", {
      method: "GET",
    })
    .then((res) => res.json())
    .then((data) => setjokes(data))
    .catch((rej) => {
      console.error(rej);
    });
```
- here i am  manually handling json response
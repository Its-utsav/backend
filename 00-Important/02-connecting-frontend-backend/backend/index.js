import express from "express"; // Morden JS
// ES modules
// import cors from "cors"
import path from "path"
const app = express()
const port = process.env.PORT || 8000;


// app.use(cors())
app.use(express.static("dist"))

// app.get("/", (req, res) => {
//     res.end("At Home")
// })

app.get("/api/jokes", (req, res) => {
    const jsJokes = [
        {
            id: 1,
            setup: "Why did the JavaScript developer leave his glasses at the coffee shop?",
            punchline: "Because he couldn't C#."
        },
        {
            id: 2,
            setup: "Why was the JavaScript developer sad?",
            punchline: "Because he didn't Node how to Express himself."
        },
        {
            id: 3,
            setup: "What's the object-oriented way to become wealthy?",
            punchline: "Inheritance."
        },
        {
            id: 4,
            setup: "Why do JavaScript developers prefer dark mode?",
            punchline: "Because light attracts bugs."
        },
        {
            id: 5,
            setup: "What did the JavaScript array say to the other array?",
            punchline: "Join me, we'll concat together!"
        }
    ];
    res.send(jsJokes)
})

app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`)
})
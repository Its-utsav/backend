```js
(async () => {
    try {
        mongoose
            .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            .then((res) => {
                console.log("Database connected");
            });

        app.on("error", (error) => {
            console.error("app is not taking with db", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`server started on ${PORT}`);
        });
    } catch (error) {
        console.error("Error while DB connection", error);
    }
})();
```

- reason for async handler
- avoid code duplication
- Proper flow of the async functions
- It is a higher order function which accepts a function as parameter

```js
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) =>
            next(error)
        );
    };
};
```

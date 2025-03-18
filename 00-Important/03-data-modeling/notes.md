- in any backend we do majority work on data , so data is very important
- What kind of data , what is structure of data , 
- What is our table schema , what will store in our table etc ... 
- Here Data modelling come into the picture
- It is a process of creating visual representation of how we structure of the data , how we will store our data ,  organized them etc.
- It also include how data is bind with together
- How data is dependent on each other

- Example
- if we are creating a todo based application , so we need to store the Todo in our DB , before we store the todo in our DB , we need to identify the what will store in our DB 
## Todo 

1. Title -> string
2. createdDate -> date / string 
3. createBy -> valid user
4. MarkAsDone -> true / false
5. Tag 
6. color


## Tag

1. Title
2. color
3. createBy
4. subTodos -> [{} , {} , {}]


## user

1. id
2. username
3. email
4. password
5. avatar
... etc

- below three line are very common in any mongoose based project

```js
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({})
export const User = mongoose.model("User", userSchema)
```
- `new mongoose.Schema({})` define the structure of our data
- `mongoose.model("User", userSchema)` it create a model for our schema 
- we export it , so we can use later in our code
- from mongoose we create model as soon as our program run and connection with mongoDB complete it automatically create structure 
- if our model name is user and it automictically suffix by s so user -> users
- Converted into plural and lowercase


----
1
```js
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    isActive: Boolean
})
export const User = mongoose.model("Users", userSchema)
```
2. super power of mongoose

```js
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        // required: [true, "password is required"],
        required: true,
    }
}, {
    timestamps: true
})
export const User = mongoose.model("Users", userSchema)
```

> todo model
```js
import mongoose, { mongo, Mongoose } from "mongoose";

const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subTodos: {
        // Array of sub todo
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "subtodo"
            }
        ]
    }
}, { timestamps: true })

export const todo = mongoose.model("todo", todoSchema)
```

---

```js
createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
```
- createdBy field is user type or user schema so it has special syntax to include / define in our schemas
- `type: mongoose.Schema.Types.ObjectId,`  provided by mongoose 
- `ref: "User",` is compulsory when we use user define model 
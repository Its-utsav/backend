# backend

## TOC

- [backend](#backend)
  - [TOC](#toc)
  - [What-is-Backend ?](#what-is-backend-)
  - [in JavaScript](#in-javascript)
  - [Project Structure](#project-structure)

## What-is-Backend ?

- `server` means a software that serve
- A backend that receive data from Client( Mobile / Browser ) process that data in server / (computer that is working 24 \* 7) interact with DB (If require) and give / return meaning full output in a form of `API` it can be json or xml or any other .
- Backend is a complex things its majority us logic and terminal based many tools are used
- It is very heavy complex logic were written
- It has two components

1. Programming Language
   1. backend can be written in Java , PHP , Python , JavaScript , GoLang , C++ with framework (We can write from scratch but we need to write a lot ) etc.
2. Database
   1. Data Process and store or get data
   2. `SQL` - MySQL , PostgreSQL , SQLite
   3. `NO-SQL` - MongoDB
   4. We do not directly interact with DB we can interact with `ORM` or `ODM`

- In backend Majority time we deal with only 3 things

1. Data
2. File
3. Other APIS (third party APIS) - Google Login etc ...

## in JavaScript

- Two main library use in developing backend in JS `express` (Server) and `mongoose` (interact with DB)
- Runtime that execute JS code `Node` , `Deno` , `Bun` etc

## Project Structure

1. `src` (Folder) - that contains all main code of the our backend (JS)
   1. `index` - Entry point for our backend
   2. `app` - configs , cookies and many more
   3. `constants` - Declare the constants
2. `package.json` - MetaData about package (JS)
3. `.env` - secretes

- common professional backend structure (folder)
- `db` - actual code that connect with DB
- `models` - schema of the data
- `controllers` - Functions (factuality) , methods
- `routes` - path or routes
- `middlewares` - Executes in middle
- `utils` - common things written here
- `more` - dependence on project
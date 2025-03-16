require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

const githubData = {
    "login": "Its-utsav",
    "id": 136555325,
    "node_id": "U_kgDOCCOrPQ",
    "avatar_url": "https://avatars.githubusercontent.com/u/136555325?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Its-utsav",
    "html_url": "https://github.com/Its-utsav",
    "followers_url": "https://api.github.com/users/Its-utsav/followers",
    "following_url": "https://api.github.com/users/Its-utsav/following{/other_user}",
    "gists_url": "https://api.github.com/users/Its-utsav/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Its-utsav/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Its-utsav/subscriptions",
    "organizations_url": "https://api.github.com/users/Its-utsav/orgs",
    "repos_url": "https://api.github.com/users/Its-utsav/repos",
    "events_url": "https://api.github.com/users/Its-utsav/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Its-utsav/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Utsav Dhimmar",
    "company": null,
    "blog": "",
    "location": "India",
    "email": null,
    "hireable": null,
    "bio": "I am Utsav. Learning How to think and code :) XD  ",
    "twitter_username": null,
    "public_repos": 4,
    "public_gists": 1,
    "followers": 6,
    "following": 4,
    "created_at": "2023-06-14T05:03:41Z",
    "updated_at": "2025-03-16T04:34:28Z"
}


app.get("/", (req, res) => {
    res.end("Hello World !!!");
});

app.get("/twitter", (req, res) => {
    res.writeHead(200, {
        "content-type": "text/html",
    });
    res.end(`<a href="https://x.com/utsav_dhimmar">Visit Twitter</a>`);
});

app.get("/logout", (req, res) => {
    res.json({
        status: "ok",
    });
});


app.get("/github", (req, res) => {
    res.json(githubData)
})

app.listen(port, () => {
    console.log(`Server started on port ${port} , http://localhost:${port}`);
});

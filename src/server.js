import exp from "constants";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const app = express();
app.set("view engine", "pug");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening to http://localhost:3000");
app.listen(3000, handleListen);

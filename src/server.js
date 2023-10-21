import exp from "constants";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
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

const handleListen = () => console.log("Listening on http://localhost:3000");
//express는 ws를 따로 지원하지 않기 때문에 function을 만들어 주어야 한다
//이렇게 해서 서버는 http와 ws 두개의 protocol을 이해할 수 있게 됨
//항상 이렇게 할 필요는 없고 websocet server만 만들어도 된다.
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
server.listen(3000, handleListen);

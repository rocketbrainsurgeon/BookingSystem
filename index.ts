import express, {Application, Request, Response} from "express";
import * as path from "path";
import * as CONFIG from "./env.json";

const app: Application = express();

app.use(
  CONFIG.HOME + "/",
  express.static(path.join(__dirname, CONFIG.PATH + "/build"))
);
app.use(
  CONFIG.HOME + "/static/js",
  express.static(path.join(__dirname, CONFIG.PATH + "/build/static/js"))
);
app.use(
  CONFIG.HOME + "/static/css",
  express.static(path.join(__dirname, CONFIG.PATH + "/build/static/css"))
);
app.use(
  CONFIG.HOME + "/static/media",
  express.static(path.join(__dirname, CONFIG.PATH + "/build/static/media"))
);

app.listen(CONFIG.PORT, ():void => console.log("listening on " + CONFIG.PORT));
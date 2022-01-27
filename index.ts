import * as express from 'express';

const app = express.default();

const enum AppConfig {
    ViewEngine = 'view engine',
    ViewDirectory = 'views',
    Port = 8080,
}

app.set(AppConfig.ViewEngine, 'ejs');
app.set(AppConfig.ViewDirectory, './views');

// define a route handler for the default home page
app.get("/", (req: express.Request, res: express.Response) => {
    res.render("index");
});

// define a route handler for the default home page
app.get("/login", (req: express.Request, res: express.Response) => {
    res.render("index");
});


// start the Express server
app.listen(AppConfig.Port, () => {
    console.log(`server started at http://localhost:${ AppConfig.Port }`);
});

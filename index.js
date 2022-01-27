"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const app = express.default();
app.set("view engine" /* ViewEngine */, 'ejs');
app.set("views" /* ViewDirectory */, './views');
app.use(express.static("./static"));
/*
* TODO:
*  - koszyk
*  - wybieranie produktu
*  - sesja - cookies
*  - autentykacja użytkownika
*  - kodowanie paska adresowego - parameter tampering
*  - podział na obsługę żądań POST/GET w routingu
*  - bazka - uwaga hasła musza być hashowane przed dodaniem (patrz wykład 10)
* */
// NOTE: wszystkie middle-ware, poza ostatnim, przyjmują 3-ci parametr: next: NextFunction
// region routing: /
app.use("/", (req, res, next) => {
    res.render("index");
});
// endregion
// region routing: /search/
app.get("/search/", (req, res, next) => {
    console.log("get search");
    res.render("search", { product_type: 'foobar' });
});
app.post("/search/", (req, res, next) => {
    let product_type = req.query.product_type;
    console.log("post search");
    res.render("search", { product_type: product_type + ' siema' });
});
// endregion
// region routing: /browse/
app.use("/browse/", (req, res, next) => {
    res.render("browse");
});
// endregion
// region routing: /login/
app.use("/login/", (req, res, next) => {
    res.render("login");
});
// endregion
// region routing: /register/
app.use("/register/", (req, res, next) => {
    res.render("login");
});
// endregion
// region routing: /product/
app.use("/product/", (req, res, next) => {
    res.render("product", { product_id: 1234321 });
});
// endregion
// region routing: 404
app.use((req, res) => {
    res.render('404.ejs', { url: req.url });
});
// endregion
// start the Express server
app.listen(8080 /* Port */, () => {
    console.log(`server started at http://localhost:${8080 /* Port */}`);
});

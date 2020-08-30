const home = require("./controllers/home.js");
const vendor = require("./controllers/vendor.js");

module.exports = function(app){
    app.get("/", home.landingPage);

    //Vendor
    app.get("/vendor", vendor.display);
    app.get("/vendor/new", vendor.new);
    app.post("/vendor", vendor.create);
    app.get("/vendor/login", vendor.loginPage);
    app.post("/vendor/login", vendor.login);
}
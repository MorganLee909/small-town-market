const home = require("./controllers/home.js");
const vendor = require("./controllers/vendor.js");

module.exports = function(app){
    app.get("/", home.landingPage);

    //Vendor
    app.get("/vendor/new", vendor.new);
    app.post("/vendor", vendor.create);
    app.get("/vendor/login", vendor.loginPage);
    app.post("/vendor/login", vendor.login);
    app.get("/vendor/:url/edit", vendor.edit);
    app.post("/vendor/:url", vendor.update);
    app.get("/vendor/:url", vendor.display);
    
}
const home = require("./controllers/home.js");
const vendor = require("./controllers/vendor.js");

module.exports = function(app){
    app.get("/", home.landingPage);

    //Vendor
    app.get("/vendors/new", vendor.new);
    app.post("/vendors", vendor.create);
    app.get("/vendors/login", vendor.loginPage);
    app.post("/vendors/login", vendor.login);
    app.get("/vendors/:url/edit", vendor.edit);
    app.post("/vendors/:url", vendor.update);
    app.get("/vendors/:url", vendor.display);
    app.get("/vendors/items/new", vendor.newItems);
}
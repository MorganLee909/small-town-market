const home = require("./controllers/home.js");
const vendor = require("./controllers/vendor.js");
const item = require("./controllers/item.js");

module.exports = function(app){
    app.get("/", home.landingPage);

    //Vendor
    app.get("/vendors/new", vendor.new);
    app.post("/vendors", vendor.create);
    app.get("/vendors/:url", vendor.display);
    app.get("/vendors/:url/edit", vendor.edit);
    app.post("/vendors/:url", vendor.update);
    app.get("/vendors/:url/destroy", vendor.destroy);

    app.get("/vendors/login", vendor.loginPage);
    app.post("/vendors/login", vendor.login);

    //Items
    //"new" action is inside vendor display
    app.post("/items", item.create);
}
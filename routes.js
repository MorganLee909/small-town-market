const home = require("./controllers/home.js");
const vendor = require("./controllers/vendor.js");

module.exports = function(app){
    app.get("/", home.landingPage);

    //Vendor
    app.get("/vendor/new", vendor.new);
}
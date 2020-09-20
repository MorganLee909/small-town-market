const Item = require("../models/item.js");
const Vendor = require("../models/vendor.js");

const Validator = require("./validator.js");

module.exports = {
    create: function(req, res){
        if(!req.session.user){
            req.session.error = "YOU MUST BE LOOGED IN TO DO THAT";
            return res.redirect("/");
        }

        const valid = Validator.item(req.body);
        let vendor = {};
        Vendor.findOne({_id: req.session.user})
            .then((response)=>{
                vendor = response;

                if(valid !== true){
                    req.session.error = valid;
                    return res.redirect(`/vendor/${vendor.url}`);
                }

                return Item.create(req.body);
            })
            .then((item)=>{
                vendor.items.push(item);

                return vendor.save();
            })
            .then((response)=>{
                return res.redirect(`/vendors/${response.url}`);
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO CREATE NEW ITEM AT THIS TIME";
                return res.redirect(`/vendors/${vendor.url}`);
            });
    }
}
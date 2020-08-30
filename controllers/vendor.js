const bcrypt = require("bcryptjs");

const Vendor = require("../models/vendor.js");
const Validator = require("./validator.js");

module.exports = {
    display: function(req, res){
        if(!req.session.user){
            req.session.error = "YOU MUST BE LOGGED IN TO VIEW THAT PAGE";
            return res.redirect("/");
        }

        Vendor.findOne({_id: req.session.user})
            .then((vendor)=>{
                return res.render("./vendor/display.ejs", {vendor: vendor});
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO FIND VENDOR";
                return res.redirect("/");
            });
    },

    new: function(req, res){
        let error = (req.session.error) ? req.session.error : undefined;
        req.session.error = undefined;
        
        return res.render("./vendor/new.ejs", {error: error});
    },

    create: async function(req, res){
        const valid = await Validator.vendor(req.body);

        if(valid !== true){
            req.session.error = valid;
            return res.redirect("/vendor/new");
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.pass, salt);

        let newVendor = new Vendor({
            name: req.body.vendorName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            state: req.body.state,
            county: req.body.county,
            city: req.body.city,
            description: req.body.description,
            password: hash
        });

        newVendor.save()
            .then((vendor)=>{
                req.session.user = vendor._id;
                return res.redirect("/vendor");
            })
            .catch((err)=>{
                console.log(err);
                req.session.error = "ERROR: UNABLE TO CREATE NEW VENDOR AT THIS TIME";
                return res.redirect("/vendor/new");
            });
    },

    loginPage: function(req, res){
        return res.render("./vendor/login.ejs");
    },

    login: function(req, res){
        Vendor.findOne({email: req.body.email})
            .then((vendor)=>{
                if(vendor){
                    bcrypt.compare(req.body.password, vendor.password, (err, result)=>{
                        if(result){
                            req.session.user = vendor._id;
                            return res.redirect("/vendor");
                        }else{
                            req.session.error = "INCORRECT PASSWORD";
                            return res.redirect("/login");
                        }
                    })
                }else{
                    req.session.error = "NO ACCOUNT EXISTS WITH THIS EMAIL";
                    return res.redirect("/login");
                }
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO LOG YOU IN AT THIS TIME";
                return res.redirect("/");
            });
    }
}
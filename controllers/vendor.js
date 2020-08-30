const bcrypt = require("bcryptjs");

const Vendor = require("../models/vendor.js");
const Validator = require("./validator.js");

module.exports = {
    display: function(req, res){
        Vendor.findOne({url: req.params.url})
            .then((vendor)=>{
                let data = {
                    vendor: vendor,
                    owner: false
                }
                if(req.session.user === vendor._id.toString()){
                    data.owner = true;
                }
                return res.render("./vendor/display.ejs", data);
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
        
        let url = req.body.vendorName.replace(/\W/g, "").toLowerCase();
        let tempUrl = url;
        let num = 0;
        while(await Vendor.findOne({url: tempUrl})){
            num++;
            tempUrl = url + num;
        }
        if(num > 0){
            url = tempUrl;
        }

        let newVendor = new Vendor({
            name: req.body.vendorName,
            firstName: req.body.firstName.toLowerCase(),
            lastName: req.body.lastName.toLowerCase(),
            email: req.body.email.toLowerCase(),
            state: req.body.state.toLowerCase(),
            county: req.body.county.toLowerCase(),
            city: req.body.city.toLowerCase(),
            description: req.body.description,
            password: hash,
            url: url
        });

        newVendor.save()
            .then((vendor)=>{
                req.session.user = vendor._id;
                return res.redirect(`/vendor/${vendor.url}`);
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO CREATE NEW VENDOR AT THIS TIME";
                return res.redirect("/vendor/new");
            });
    },

    loginPage: function(req, res){
        return res.render("./vendor/login.ejs");
    },

    login: function(req, res){
        const email = req.body.email.toLowerCase();
        Vendor.findOne({email: email})
            .then((vendor)=>{
                if(vendor){
                    bcrypt.compare(req.body.password, vendor.password, (err, result)=>{
                        if(result){
                            req.session.user = vendor._id;
                            return res.redirect(`/vendor/${vendor.url}`);
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
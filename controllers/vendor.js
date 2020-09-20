const bcrypt = require("bcryptjs");

const Vendor = require("../models/vendor.js");
const Validator = require("./validator.js");
const Helper = require("./helper.js");

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
            return res.redirect("/vendors/new");
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.pass, salt);
        
        let newVendor = new Vendor({
            name: req.body.vendorName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(),
            state: req.body.state,
            county: req.body.county,
            city: req.body.city,
            description: req.body.description,
            password: hash,
            url: await Helper.createURL(req.body.vendorName)
        });

        newVendor.save()
            .then((vendor)=>{
                req.session.user = vendor._id;
                return res.redirect(`/vendors/${vendor.url}`);
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO CREATE NEW VENDOR AT THIS TIME";
                return res.redirect("/vendors/new");
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
                            return res.redirect(`/vendors/${vendor.url}`);
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
    },

    edit: function(req, res){
        Vendor.findOne({url: req.params.url})
            .then((vendor)=>{
                if(vendor._id.toString() !== req.session.user){
                    req.session.error = "YOU CANNOT EDIT THIS VENDOR";
                    return res.redirect(`/vendors/${req.params.url}`);
                }

                return res.render("./vendor/edit.ejs", {vendor: vendor});
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO LOAD THE PAGE";
                return res.redirect(`/vendors/${req.params.url}`);
            });
    },

    update: function(req, res){
        Vendor.findOne({url: req.params.url})
            .then(async (vendor)=>{
                if(vendor._id.toString() !== req.session.user){
                    req.session.error = "YOU CANNOT EDIT THIS VENDOR";
                    return res.redirect(`/vendors/${req.params.url}`);
                }

                vendor.name = (req.body.name === "") ? vendor.name : req.body.name;
                vendor.firstName = (req.body.firstName === "") ? vendor.firstName : req.body.firstName;
                vendor.lastName = (req.body.lastName === "") ? vendor.lastName : req.body.lastName;
                vendor.email = (req.body.email === "") ? vendor.email : req.body.email.toLowerCase();
                vendor.state = (req.body.state === "") ? vendor.state : req.body.state;
                vendor.county = (req.body.county === "") ? vendor.county : req.body.county;
                vendor.city = (req.body.city === "") ? vendor.city : req.body.city;
                vendor.description = (req.body.description === "") ? vendor.description : req.body.description;
                vendor.url = (req.body.url === "") ? vendor.url : await Helper.createURL(req.body.name);

                return vendor.save();
            })
            .then((vendor)=>{
                return res.redirect(`/vendors/${vendor.url}`);
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO UPDATE YOUR DATA AT THIS TIME";
                return res.redirect(`/vendors/${req.params.url}`);
            });
    },

    destroy: function(req, res){
        Vendor.deleteOne({url: req.params.url})
            .then((response)=>{
                return res.redirect("/");
            })
            .catch((err)=>{
                req.session.error = "ERROR: UNABLE TO DELETE ACCOUNT.  PLEASE TRY AGAIN LATER";
                return res.redirect(`/vendors/${req.params.url}/edit`);
            });
    },

    newItems: function(req, res){
        if(!req.session.user){
            req.session.error = "YOU MUST BE LOGGED IN TO DO THAT";
            return res.redirect("/");
        }

        return res.render("./vendor/newItems.ejs");
    }
}
const Vendor = require("../models/vendor.js");

module.exports = {
    vendor: async function(data){
        if(await Vendor.findOne({email: data.email})){
            return "A vendor already exists with this email address";
        }

        const sanitizeList = [
            data.vendorName,
            data.firstName,
            data.lastName,
            data.state,
            data.county,
            data.city,
            data.description
        ]

        if(!this.isSanitary(sanitizeList)){
            return "Data contains illegal characters [\\,<,>,$,(,),{,}]"
        }

        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)){
            return "Invalid email address";
        }

        if(data.pass !== data.confirmPass){
            return "Passwords do not match";
        }

        if(data.pass.length < 10){
            return "Password must be at least 10 characters";
        }

        return true;
    },

    isSanitary: function(strings){
        let disallowed = ["\\", "<", ">", "$", "{", "}", "(", ")"];

        for(let i = 0; i < strings.length; i++){
            for(let j = 0; j < disallowed.length; j++){
                if(strings[i].includes(disallowed[j])){
                    return false;
                }
            }
        }

        return true;
    }
}
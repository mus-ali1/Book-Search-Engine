const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");


const resolvers = {
    Query : {
        me: async (parent, args, context) => {
            if(context.user){
                return User.findOne({_id: context.user._id}).populate("savedBooks")
            }
            throw new AuthenticationError("You must be logged in!");
        }

    }

}
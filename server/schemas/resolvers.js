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
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user){
                throw new AuthenticationError("Login details incorrect.");
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError("Login details incorrect.");
            }

            const token = signToken(user);
            return {token, user};
        },


    }

}
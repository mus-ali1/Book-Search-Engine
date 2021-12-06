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

           addUser: async(parent, {email, username, password}) => {
            if(!email || !username || !password){
                throw new AuthenticationError("Insufficient details provided to create a user!")
            }
            const newUser = await User.create({username, email, password});
            const token = signToken(newUser);
            
            return {token, user: newUser}


    },  saveBook: async(parent, {input}, context) => {
        if(context.user){
            const user = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$addToSet: {savedBooks: input}},
                {new: true, runValidators: true}
            )

            return user;
        }

        throw new AuthenticationError("You are not logged in.")
    },



}

}
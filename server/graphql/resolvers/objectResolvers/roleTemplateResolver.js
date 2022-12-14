// const { User } = require('../../../models/user');
const { Members } = require('../../../models/membersModel');
const { Skills } = require('../../../models/skillsModel');
const { Projects } = require('../../../models/projectsModel');
const { RoleTemplate } = require('../../../models/roleTemplateModal');

const { ApolloError } = require('apollo-server-express');



module.exports = {
   RoleTemplate: {
      skills: async (parent, args, context, info) => {
       //console.log("parent = " , parent)

         try {
            const skillsID = parent.skills;

            // console.log("skillsID = " , skillsID)



            skillData = await Skills.find({_id: skillsID})
         


            return skillData;

         } catch (err) {
            throw new ApolloError(
               err.message,
               err.extensions?.code || 'DATABASE_SEARCH_ERROR',
               {
                  component: 'userResolver > skills',
                  user: context.req.user?._id,
               }
            );
         }
      },
   },
   
};

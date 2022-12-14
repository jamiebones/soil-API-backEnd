// const { User } = require('../../../models/user');

const { Skills } = require('../../../models/skillsModel');
const { SkillSubCategory} = require("../../../models/skillSubCategoryModel");
const { ApolloError } = require('apollo-server-express');



module.exports = {
   SkillCategory: {
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
      subCategorySkill: async (parent, args, context, info) => {
         //console.log("parent = " , parent)
  
           try {
              const subCategorySkill = parent.subCategorySkill;
  
              // console.log("subCategorySkill = " , subCategorySkill)
  
  
  
              SkillSubCategoryData = await SkillSubCategory.find({_id: subCategorySkill})
           
  
  
              return SkillSubCategoryData;
  
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

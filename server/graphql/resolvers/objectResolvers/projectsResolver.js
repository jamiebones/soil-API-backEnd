// const { User } = require('../../../models/user');
const { Members } = require('../../../models/membersModel');
const { Skills } = require('../../../models/skillsModel');
const { Projects } = require('../../../models/projectsModel');

const { ApolloError } = require('apollo-server-express');

module.exports = {
   Project: {
      champion: async (parent, args, context, info) => {
       //console.log("parent = " , parent)

         try {
            const champion = parent.champion;


            championData = await Members.findOne({_id: champion})

        //console.log("championData = " , championData)


            return championData;

         } catch (err) {
            throw new ApolloError(
               err.message,
               err.extensions?.code || 'DATABASE_SEARCH_ERROR',
               {
                  component: 'userResolver > members',
                  user: context.req.user?._id,
               }
            );
         }
      },
      team: async (parent, args, context, info) => {
       //console.log("parent = " , parent)

         try {
            const team = parent.team;


            return team;

         } catch (err) {
            throw new ApolloError(
               err.message,
               err.extensions?.code || 'DATABASE_SEARCH_ERROR',
               {
                  component: 'userResolver > members',
                  user: context.req.user?._id,
               }
            );
         }
      },
   },
   teamType: {
      members: async (parent, args, context, info) => {
         //console.log("parent = " , parent)
  
           try {
              const members = parent.members;
  
              memberData = await Members.findOne({_id: members})
  
  
              return memberData;
  
           } catch (err) {
              throw new ApolloError(
                 err.message,
                 err.extensions?.code || 'DATABASE_SEARCH_ERROR',
                 {
                    component: 'userResolver > members',
                    user: context.req.user?._id,
                 }
              );
           }
        },
   },
   roleType: {
      skills: async (parent, args, context, info) => {
         //console.log("parent = " , parent)
  
           try {
              const skills = parent.skills;
  
            //   memberData = await Members.findOne({_id: members})

            console.log("skills - roleResolver = " , skills)
  
  
              return skills;
  
           } catch (err) {
              throw new ApolloError(
                 err.message,
                 err.extensions?.code || 'DATABASE_SEARCH_ERROR',
                 {
                    component: 'userResolver > members',
                    user: context.req.user?._id,
                 }
              );
           }
        },
   },
   skillRoleType: {
      skill: async (parent, args, context, info) => {
         //console.log("parent = " , parent)
  
           try {
              const skill = parent.skill;
  
            //   memberData = await Members.findOne({_id: members})

            console.log("skill - roleResolver = " , skill)
  
            skillData = await Skills.findOne({_id: skill})
  
              return skillData;
  
           } catch (err) {
              throw new ApolloError(
                 err.message,
                 err.extensions?.code || 'DATABASE_SEARCH_ERROR',
                 {
                    component: 'userResolver > members',
                    user: context.req.user?._id,
                 }
              );
           }
        },
   },
};
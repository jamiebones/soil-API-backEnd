const { Rooms } = require("../../../models/roomsModel");
const { Members } = require("../../../models/membersModel");
const { Skills } = require("../../../models/skillsModel");
const {ApolloError} = require("apollo-server-express");

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub()




module.exports = {
    createRoom: async (parent, args, context, info) => {
   
        const {_id,name} = args.fields;
        console.log("Mutation > createRoom > args.fields = " , args.fields)

        // if (!_id) throw new ApolloError( "_id is required, the IDs come from Discord");
        // if (!name) throw new ApolloError( "You need to specify the name of the Room");

        let fields = {
            registeredAt: new Date(),
        };

        if (_id) fields = {...fields,_id}
        if (name) fields = {...fields,name}
        

        try {

            let roomData

            roomData = await Rooms.findOne({ _id: fields._id })


            if (!roomData){
                roomData = await new Rooms(fields);
                
                roomData.save()
                
            } else {
                roomData= await Rooms.findOneAndUpdate(
                {name: fields.name},
                {
                    $set: fields
                },
                {new: true}
                )
            }
            
            

            return roomData
            } catch (err) {
            throw new ApolloError(
                err.message,
                err.extensions?.code || "DATABASE_FIND_TWEET_ERROR",
                { component: "tmemberQuery > createRoom"}
            );
        }
    },

    enterRoom: async (parent, args, context, info) => {
        const {roomID,memberID} = args.fields;
        console.log("Mutation > enterRoom > args.fields = " , args.fields)

        if (!roomID) throw new ApolloError( "_id is required, the IDs come from Discord");
        if (!memberID) throw new ApolloError( "You need to specify the memberId to enter the Room");

        let fields = {
            roomID,
            memberID
        };

        try {

            let roomData

            roomData = await Rooms.findOne({ _id: fields.roomID })
            if(!roomData) throw new ApolloError( "RoomId does Not exists");

            const isMemberInTheRoom = roomData.members.indexOf(memberID) === -1 ? false : true;
            console.log(roomData)
            if(!isMemberInTheRoom) {
                const updatedMember = [...roomData.members, memberID]
                roomData= await Rooms.findOneAndUpdate(
                    {_id: fields.roomID},
                    {
                        members: updatedMember
                    },
                    {new: true}
                )
            }
            pubsub.publish(roomData._id, {
                roomUpdated: roomData
            })
            return roomData
        } catch (err) {
            throw new ApolloError(
                err.message,
                err.extensions?.code || "DATABASE_FIND_TWEET_ERROR",
                { component: "tmemberQuery > enterRoom"}
            );
        }
    },
    exitRoom: async (parent, args, context, info) => {
        const {roomID,memberID} = args.fields;
        console.log("Mutation > exitRoom > args.fields = " , args.fields)

        if (!roomID) throw new ApolloError( "_id is required, the IDs come from Discord");
        if (!memberID) throw new ApolloError( "You need to specify the memberId to Exit the Room");

        let fields = {
            roomID,
            memberID
        };

        try {

            let roomData

            roomData = await Rooms.findOne({ _id: fields.roomID })
            if(!roomData) throw new ApolloError( "RoomId does Not exists");

            const isMemberInTheRoom = roomData.members.indexOf(memberID) === -1 ? false : true;
            if(!isMemberInTheRoom) throw new ApolloError("Member is not in the Room.")
            console.log(roomData)
            if(isMemberInTheRoom) {
                const tempMembers = roomData.members
                delete tempMembers[roomData.members.indexOf(memberID)]
                const updatedMember = tempMembers.filter((memberID) => memberID)
                roomData= await Rooms.findOneAndUpdate(
                    {_id: fields.roomID},
                    {
                        members: updatedMember
                    },
                    {new: true}
                )
            }
            pubsub.publish(roomData._id, {
                roomUpdated: roomData
            })
            return roomData
        } catch (err) {
            throw new ApolloError(
                err.message,
                err.extensions?.code || "DATABASE_FIND_TWEET_ERROR",
                { component: "tmemberQuery > exitRoom"}
            );
        }
    },


    updateMemberInRoom: async (parent, args, context, info) => {

        const {discordName,memberID,discordAvatar,discriminator,bio,
            hoursPerWeek,previusProjects,
            interest,timeZone,level,skills,links,content,serverID,onbording,memberRole, roomID} = args.fields;
      
            console.log("Mutation > updateMemberInRoom > args.fields = " , args.fields)
      
          if (!memberID) throw new ApolloError( "member id is required");
          if (!roomID) throw new ApolloError( "room id is required");
      
          let fields = {
            _id: memberID,
            registeredAt: new Date(),
          };
      
          if (discordAvatar) fields =  {...fields,discordAvatar}
          if (discordName) fields =  {...fields,discordName}
          if (discriminator) fields =  {...fields,discriminator}
          if (bio) fields =  {...fields,bio}
          if (hoursPerWeek) fields =  {...fields,hoursPerWeek}
          if (previusProjects) fields =  {...fields,previusProjects}
          if (interest) fields =  {...fields,interest}
          if (timeZone) fields =  {...fields,timeZone}
          if (level) fields =  {...fields,level}
          if (skills) fields =  {...fields,skills}
          if (links) fields =  {...fields,links}
          if (content) fields =  {...fields,content}
          if (memberRole) fields = {...fields, memberRole}
      
      
          
      
          try {
      
            let membersData = await Members.findOne({ _id: fields._id })
      
            if (!membersData ){
              let newAttributes = {
                Director: 0,
                Motivator: 0,
                Inspirer: 0,
                Helper: 0,
                Supporter: 0,
                Coordinator: 0,
                Observer: 0,
                Reformer: 0,
              }
          
              fields = {...fields, attributes: newAttributes};
      
              if (onbording) fields = {...fields, onbording: onbording}
      
              if (serverID) fields.serverID = serverID;
      
              membersData = await new Members(fields);
              
              membersData.save()
      
              //add member node to neo4j
            } else {
      
              if (onbording){
                if (onbording.signup!= undefined && onbording.percentage!= undefined){
                  fields = {...fields, onbording: onbording}
                } else if (onbording.signup!= undefined ){
                  fields = {...fields, onbording: {...membersData.onbording, signup: onbording.signup}}
                } else if (onbording.percentage!= undefined ){
                  fields = {...fields, onbording: {...membersData.onbording, percentage: onbording.percentage}}
                }
              }
      
              if (!membersData.serverID){
      
                if (serverID) fields.serverID = serverID;
              } else {
                let serverID_new = [...membersData.serverID]
                if (!membersData.serverID.includes(serverID)){
                  serverID_new.push(serverID)
                }
                if (serverID) fields.serverID = serverID_new;
      
              }
      
              membersData = await Members.findOneAndUpdate({ _id: fields._id }, fields, { new: true });
              
            }
       
      
            pubsub.publish("SKILL_UPDATED_IN_ROOM" + roomID, {
              memberUpdatedInRoom: membersData
            })
            return membersData
          } catch (err) {
            throw new ApolloError(
              err.message,
              err.extensions?.code || "DATABASE_FIND_TWEET_ERROR",
              { component: "tmemberQuery > findMember"}
            );
          }
        },
    roomUpdated: {
        subscribe: (parent, args, context, info) => {
            const {_id} = args.fields;
            console.log("Mutation > roomUpdated > args.fields = " , args.fields)

            if (!_id) throw new ApolloError( "_id is required, the IDs come from Discord");
            return pubsub.asyncIterator(_id)
        }
    },

    memberUpdatedInRoom: {
        subscribe: (parent, args, context, info) => {
            const {_id} = args.fields;
            console.log("Mutation > newSkillInRoom > args.fields = " , args.fields)
            if (!_id) throw new ApolloError( "_id is required, the IDs come from Discord");
            return pubsub.asyncIterator("SKILL_UPDATED_IN_ROOM" + _id)

        }
    }
}
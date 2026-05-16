import Note from "../model/note.model.js"
import Label from "../model/label.model.js";
import AppError from "../utils/AppError.js";
import redisClient from "../config/redis.js";
import { clearNotesCache } from "../config/cache.js";
import User from "../model/user.model.js";
import { getChannel } from "../config/rabitMq.js";


export const createNoteService = async (data, userId) =>{

    // Destructure all possible fields (add more if needed)
    const {
        title = "",
        content,
        labels = [],        
        isPinned = false,
        isArchived = false,
        isDeleted = false,
        color = "#ffffff",
        reminder = null,
        collaborators = []
    } = data;

    if (!content) {
        throw new AppError("Content is required", 400);
    }

    //  Normalize + deduplicate labels (REQUEST LEVEL)
    const uniqueLabels = [
        ...new Set(
        labels.map(l => l.trim().toLowerCase())
        )
    ];

    let labelId = [];

    if (uniqueLabels.length > 0) {
        for (let name of uniqueLabels) {

            //  Find or create (DB LEVEL uniqueness)
            let label = await Label.findOne({ name, userId });

            if (!label) {
                try {
                label = await Label.create({ name, userId });
                } catch (err) {
                label = await Label.findOne({ name, userId });
                }
            }

            labelId.push(label._id);
        }
    }

    /**
     * COLLABORATOR LOGIC
     */
    const users = await User.find({
      email :  { $in : collaborators }
    });

    /**
    * INVALID USERS
    */
    const foundEmails =
        users.map(user => user.email);

    const invalidEmails =
        collaborators.filter(
            email => !foundEmails.includes(email)
        );

    if(invalidEmails.length > 0){

      throw new AppError(
          `Users not registered: ${invalidEmails.join(", ")}`,
          404
      );
    }


    const collaboratorIds = users.map(user => user._id);

    // Create note with all fields
    const note = await Note.create({
        title,
        content,
        userId,
        labelId,
        isPinned,
        isArchived,
        isDeleted,
        color,
        reminder,
        collaborators : collaboratorIds
    });

    /**
     * PRODUCE TO RABBITMQ QUEUE
     */
    const channel = getChannel();

    for(let user of users){
      
        const email = user.email;

        channel.sendToQueue(
          "emailQueue",

        Buffer.from(
            JSON.stringify({
              email,
              noteTitle : note.title
              })
            )
        );
    }

    //clear cache
    await clearNotesCache(userId);
    return note;
}


export const getAllNotesService = async (userId) =>{

    const cacheKey = `note:${userId}`;

    /**
     * FROM REDIS CACHE
     */
    const cachedNotes = await redisClient.get(cacheKey);

    if(cachedNotes){
      console.log("FROM CACHE");
      return JSON.parse(cachedNotes);
    }

    /**
     * FROM MONGODB
     */
    const notes = await Note.find(
      {
        $or : [
          { userId },
          { collaborators : userId } 
        ],
        isDeleted : false
      }
    ).limit(20);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(notes));

    console.log("FROM DATABASE");
    return notes;
}

export const getSingleNoteService = async (noteId , userId) => {
    const note = await Note.findOne(
      {
          _id : noteId ,
          $or : [
            { userId },
            { collaborators : userId }
          ],
          isDeleted : false
      }
    );
    return note;
}


export const updateNoteService = async (noteId, userId, data) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId , isDeleted : false},
    data,
    { new: true }
  );
  //clear cache
  await clearNotesCache(userId);
  return note;
};

export const deleteNoteService = async (noteId, userId) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId , isDeleted : false},
    { isDeleted: true },
    { new: true }
  );
  //clear cache
  await clearNotesCache(userId);
  return note;
};

export const togglePinService = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  note.isPinned = !note.isPinned;

  //clear cache
  await clearNotesCache(userId);
  return await note.save();
};

export const toggleArchiveService = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  note.isArchived = !note.isArchived;

  //clear cache
  await clearNotesCache(userId); 
  return await note.save();
};

export const restoreNoteService = async (noteId, userId) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { isDeleted: false },
    { new: true }
  );
  //clear cache
  await clearNotesCache(userId);
  return note;
};

export const changeColorService = async (noteId, userId, color) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { color : color },
    { new: true }
  );
  //clear cache
  await clearNotesCache(userId);
  return note;
};

export const addReminderService = async (noteId, userId ,reminder) => {
  const note = await Note.findOneAndUpdate(
     {_id : noteId , userId},
     { reminder},
     { new : true }
  );
  //clear cache
  await clearNotesCache(userId);
  return note;
}

export const deleteReminderService = async (noteId, userId) => {
  const note =  await Note.findOneAndUpdate(
     {_id : noteId , userId},
     { reminder : null },
     { new : true }
  );

  //clear cache
  await clearNotesCache(userId);
  return note;
}


export const addCollaboratorService = async (
   userId,
   noteId,
   collaborators
) => {

   /**
    * FIND REGISTERED USERS
    */
   const users = await User.find({

      email: { $in: collaborators }
   });

   /**
    * CHECK INVALID EMAILS
    */
   const foundEmails =
      users.map(user => user.email);

   const invalidEmails =
      collaborators.filter(
         email => !foundEmails.includes(email)
      );

   if(invalidEmails.length > 0){

      throw new AppError(

         `Users not registered: ${invalidEmails.join(", ")}`,

         404
      );
   }

   /**
    * CHECK NOTE EXISTS
    */
   const note = await Note.findOne({

      _id: noteId,

      userId
   });

   if(!note){

      throw new AppError(
         "Note not found",
         404
      );
   }

   /**
    * EXTRACT USER IDS
    */
   const collaboratorIds =
      users.map(user => user._id);

   /**
    * ADD COLLABORATORS
    */
   const updatedNote =
      await Note.findByIdAndUpdate(

         noteId,

         {
            $addToSet: {

               collaborators: {
                  $each: collaboratorIds
               }
            }
         },

         { new: true }
      );

   /**
    * PRODUCER
    */
   const channel = getChannel();

   for(const user of users){

      channel.sendToQueue(

         "emailQueue",

         Buffer.from(

            JSON.stringify({

               type : "collaboration",

               email: user.email,

               noteTitle: note.title
            })
         )
      );
   }

   return updatedNote;
}

export const getLabelsOfNoteService = async (userId , noteId) => {
    return await Note.find(
      {_id : noteId , userId}
    ).populate("labelId");
}

export const addLabelToNoteService = async (userId , noteId , lId) => {

    const label = await Label.findOne({ _id: lId, userId });
        if (!label) throw new AppError("Invalid label");

    const note =  await Note.findOneAndUpdate(
      {_id : noteId , userId, isDeleted : false},
      { $addToSet : { labelId : lId }},
      { new: true }
    );

    //clear cache
    await clearNotesCache(userId);
    return note;
}

export const removeLabelFromNoteService = async (userId , noteId , lId) => {
    const note =  await Note.findOneAndUpdate(
      {_id : noteId , userId},
      { $pull : { labelId : lId }},
      { new: true }
    );

    //clear cache
    await clearNotesCache(userId);
    return note;
}

export const getArchivedNotesService = async (userId) => {
  return await Note.find(
    {userId , isArchived : true , isDeleted : false}
  );
}

export const getTrashNotesService = async (userId) => {
  return await Note.find(
    {userId , isDeleted : true}
  );
}
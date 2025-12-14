/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CHATROOM_SEARCHABLE_FIELDS } from './ChatRoom.constant';
import mongoose from 'mongoose';
import { ChatRoom } from './ChatRoom.model';
import { User } from '../User/user.model';
import { Chat } from '../Chat/Chat.model';

const createChatRoomIntoDB = async (
  payload: any,
) => {
 
const { userId1, userId2 } = payload;
// console.log('contractorId', contractorId)
// console.log('customerId', customerId)
  let room = await ChatRoom.findOne({
    participants: { $all: [userId1, userId2] },
  });

  if (!room) {
    room = await ChatRoom.create({ participants: [userId1, userId2] });
  }

  
  if (!room) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create ChatRoom');
  }
//  console.log('room', room)
  return room;
};

const getAllChatRoomsFromDB = async (query: Record<string, unknown>) => {
  const ChatRoomQuery = new QueryBuilder(
    ChatRoom.find(),
    query,
  )
    .search(CHATROOM_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ChatRoomQuery.modelQuery;
  const meta = await ChatRoomQuery.countTotal();
  return {
    result,
    meta,
  };
};
// const getAllMyChatRoomsFromDB = async (id: string, query: Record<string, unknown>) => {
//   const ChatRoomQuery = new QueryBuilder(
//     ChatRoom.find( { participants: id } ),
//     query,
//   )
//     .search(CHATROOM_SEARCHABLE_FIELDS)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await ChatRoomQuery.modelQuery;
//   const meta = await ChatRoomQuery.countTotal();
//   return {
//     result,
//     meta,
//   };
// };

const getAllMyChatRoomsFromDB = async (
  query: Record<string, unknown>,
  user: any
) => {

   const usr = await User.isUserExistsByCustomEmail(user.userEmail);
   if(!usr){
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
   }

  // console.log('usr?._id', usr?._id)
  // console.log('userId', userId)

 const userId = (usr as any)?._id

  const ChatRoomQuery = new QueryBuilder(
    ChatRoom.find({ participants: userId }),
    query
  )
    .search(CHATROOM_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const rooms = await ChatRoomQuery.modelQuery;
  const meta = await ChatRoomQuery.countTotal();


  // console.log('rooms', rooms)

  const enrichedRooms = await Promise.all(
    rooms.map(async (room: any) => {
        // console.log('room', room)
      // Get the "other" participant (not the current user)
      const otherUserId = room.participants.find(
        (id: string) => id.toString() !== userId.toString()
      );
      console.log("My user Id",userId, "Other User Id",otherUserId);
      if(userId===otherUserId){
        console.log("Both user Id are same");
      }
      if (!otherUserId) {
        // If somehow user is chatting with themselves or invalid data
        return {
          ...room.toObject(),
          otherUserName: null,
          otherUserImage: null,
          lastMessage: null,
          lastMessageTime: null,
        };
      }

      // Fetch user and last message in parallel
      const [otherUser, lastMessage] = await Promise.all([
        User.findById(otherUserId).select('name.firstName name.lastName profileImg  _id').lean(),
        Chat.findOne({ chatRoomId: room._id })
          .sort({ createdAt: -1 })
          .select('message createdAt')
          .lean(),
      ]);

      return {
        ...room.toObject(),
        otherUserName: otherUser?.name || null,
        otherUserImage: otherUser?.profileImg || null,
        otherUserId: otherUser?._id || null,
        lastMessage: lastMessage?.message || null,
      //  lastMessageTime: lastMessage && lastMessage.createdAt ? new Date(lastMessage.createdAt) : null,
        lastMessageTime: lastMessage?.createdAt || null,
      };
    
//     return {
//   ...room.toObject(),
//   otherUserName: otherUser?.fullName || null,
//   otherUserImage: otherUser?.img || null,
//   lastMessage: lastMessage?.message || null,
//   lastMessageTime: (lastMessage?.createdAt instanceof Date || typeof lastMessage?.createdAt === 'string')
//     ? new Date(lastMessage.createdAt)
//     : null,
// };

    })
  );

  return {
    result: enrichedRooms,
    meta,
  };
};


// const getAllMyChatRoomsFromDB = async (userId: string, query: Record<string, unknown>) => {
//   const ChatRoomQuery = new QueryBuilder(
//     ChatRoom.find({ participants: userId }),
//     query,
//   )
//     .search(CHATROOM_SEARCHABLE_FIELDS)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const rooms = await ChatRoomQuery.modelQuery;
//   const meta = await ChatRoomQuery.countTotal();

//   const enrichedRooms = await Promise.all(
//     rooms.map(async (room) => {
//       const otherUserId = room.participants.find((id: string) => id !== userId);


      
//     const [otherUser, lastMessage] = await Promise.all([
//   User.findById(otherUserId).select('fullName img').lean(),
//   Chat.findOne({ chatRoomId: room._id }).sort({ createdAt: -1 }).select('message createdAt').lean(),
// ]);

// const lastMessageWithCreatedAt = lastMessage as any;

// return {
//   ...room.toObject(),
//   otherUserName: otherUser?.fullName || null,
//   otherUserImage: otherUser?.img || null,
//   lastMessage: lastMessageWithCreatedAt.message || null,
//   lastMessageTime: lastMessageWithCreatedAt.createdAt || null,
// };
//     })
//   );

//   return {
//     result: enrichedRooms,
//     meta,
//   };
// };

const getSingleChatRoomFromDB = async (id: string) => {
  const result = await ChatRoom.findById(id);

  return result;
};

const updateChatRoomIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('chatrooms')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('ChatRoom not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted ChatRoom');
  }

  const updatedData = await ChatRoom.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('ChatRoom not found after update');
  }

  return updatedData;
};

const deleteChatRoomFromDB = async (id: string) => {
  const deletedService = await ChatRoom.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete ChatRoom');
  }

  return deletedService;
};

export const ChatRoomServices = {
  createChatRoomIntoDB,
  getAllChatRoomsFromDB,
  getSingleChatRoomFromDB,
  updateChatRoomIntoDB,
  deleteChatRoomFromDB,
  getAllMyChatRoomsFromDB
};

import Dexie from 'dexie';

export const database = new Dexie('simpleChat');
database.version(1).stores({
  chats: '++id, title, updatedDate',
  chatDetails: '++id, chatId, message, role, createdDate, token, model',
});

import {sqliteTable,text,integer,primaryKey} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('tiangong_records',{
 owner:text('owner').notNull(),key:text('key').notNull(),value:text('value').notNull(),revision:integer('revision').notNull().default(1),updated:integer('updated').notNull()
},t=>[primaryKey({columns:[t.owner,t.key]})]);

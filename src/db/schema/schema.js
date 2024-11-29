import {boolean, integer, pgTable, serial, time, varchar} from "drizzle-orm/pg-core"

export  const BatchTable = pgTable('batch',{
    id: serial('id').primaryKey().unique(),
    name: varchar('name', {length:200}).notNull(),
    students: integer('students').notNull(),
    year:integer('year').notNull(),
    batch_time: time('batch_time'),
    batch_days_id: integer('batch_days'),
    type:varchar('type', {length:100}),
    status: boolean('status'),
})
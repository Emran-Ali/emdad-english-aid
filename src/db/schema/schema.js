import {boolean, integer, pgTable, serial, time, varchar, timestamp} from "drizzle-orm/pg-core"

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  profilePhoto: varchar('profile_photo', { length: 255 }).notNull(), // URL to profile photo
  name: varchar('name', { length: 255 }).notNull(), // Full name
  email: varchar('email', { length: 255 }).notNull().unique(), // Unique email
  contactNumber: varchar('contact_number', { length: 20 }).notNull(), // Contact number
  password: varchar('password', { length: 255 }).notNull(), // Hashed password
  address: varchar('address', { length: 255 }), // Address field
});


export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull(), // Foreign key to users table
  roleId: varchar('role_id').notNull(), // Foreign key to roles table
});

export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id'),
  refreshToken: varchar('refresh_token', { length: 255 }).unique(),
  userAgent: varchar('user_agent', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 255 }),
  isRevoked: boolean('is_revoked').default(false),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

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
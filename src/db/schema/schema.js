import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  time,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

export const rolesEnum = pgEnum('role', ['user', 'admin', 'student', 'stuff']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  profilePhoto: varchar('profile_photo', {length: 255}).notNull(),
  name: varchar('name', {length: 255}).notNull(),
  email: varchar('email', {length: 255}).notNull().unique(),
  contactNumber: varchar('contact_number', {length: 20}), // Make this nullable for Google users
  password: varchar('password', {length: 255}), // Make password nullable
  address: varchar('address', {length: 255}),
  roleId: rolesEnum().default('user'),
  provider: varchar('provider', {length: 50}).default('credentials'), // Add provider field
  googleId: varchar('google_id', {length: 255}), // Add Google ID field
  ...timestamps,
});
export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  refreshToken: varchar('refresh_token', {length: 500}).notNull(),
  userAgent: varchar('user_agent', {length: 500}),
  ipAddress: varchar('ip_address', {length: 100}),
  expiresAt: timestamp('expires_at').notNull(),
  ...timestamps,
});

export const batchTable = pgTable('batch', {
  id: serial('id').primaryKey().unique(),
  name: varchar('name', {length: 200}).notNull(),
  students: integer('students').notNull(),
  year: integer('year').notNull(),
  batch_time: time('batch_time'),
  batchDaysId: integer('batch_day_id').references(() => batchDay.id),
  type: varchar('type', {length: 100}),
  status: boolean('status'),
  ...timestamps,
});

export const dayEnum = pgEnum('day', [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]);

export const batchDay = pgTable('batch_day', {
  id: serial('id').primaryKey().unique(),
  name: varchar('name', {length: 200}).notNull(),
  dayPerWeek: integer('day_per_week').notNull().default(3),
  days: dayEnum('days').array().notNull(),
});

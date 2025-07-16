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
import {array} from 'yup';

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
  contactNumber: varchar('contact_number', {length: 20}).notNull(),
  password: varchar('password', {length: 255}).notNull(),
  address: varchar('address', {length: 255}),
  roleId: rolesEnum().default('user'),
  ...timestamps,
});

export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id'),
  refreshToken: varchar('refresh_token', {length: 255}).unique(),
  userAgent: varchar('user_agent', {length: 255}),
  ipAddress: varchar('ip_address', {length: 255}),
  isRevoked: boolean('is_revoked').default(false),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const batchTable = pgTable('batch', {
  id: serial('id').primaryKey().unique(),
  name: varchar('name', {length: 200}).notNull(),
  students: integer('students').notNull(),
  year: integer('year').notNull(),
  batch_time: time('batch_time'),
  batchDaysId: integer('batch_day_id').references(() => BatchDay.id),
  type: varchar('type', {length: 100}),
  status: boolean('status'),
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

export const BatchDay = pgTable('batch_day', {
  id: serial('id').primaryKey().unique(),
  name: varchar('name', {length: 200}).notNull(),
  dayPerWeek: integer('day_per_week').notNull().default(3),
  days: array(dayEnum).notNull(),
});

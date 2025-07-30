import {
  boolean,
  date,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

// Common timestamps
const timestamps = {
  updated_at: timestamp('updated_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'),
};

// Enums
export const rolesEnum = pgEnum('role', ['admin', 'staff', 'student']);
export const batchTypeEnum = pgEnum('batch_type', [
  'academic_hsc1',
  'academic_hsc2',
  'admission',
  're_admission',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'partial',
  'completed',
  'failed',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'cash',
  'bank_transfer',
  'mobile_banking',
  'card',
]);
export const examTypeEnum = pgEnum('exam_type', [
  'weekly',
  'monthly',
  'midterm',
  'final',
  'practice',
]);
export const attendanceStatusEnum = pgEnum('attendance_status', [
  'present',
  'absent',
  'late',
  'excused',
]);
export const dayEnum = pgEnum('day', [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]);
export const expenseTypeEnum = pgEnum('expense_type', [
  'salary',
  'rent',
  'utilities',
  'materials',
  'other',
]);

// Users table (improved)
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    profilePhoto: varchar('profile_photo', {length: 255}),
    name: varchar('name', {length: 255}).notNull(),
    email: varchar('email', {length: 255}).notNull().unique(),
    contactNumber: varchar('contact_number', {length: 20}),
    password: varchar('password', {length: 255}),
    address: varchar('address', {length: 500}),
    role: rolesEnum('role').default('student').notNull(),
    provider: varchar('provider', {length: 50}).default('credentials'),
    googleId: varchar('google_id', {length: 255}),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      emailIdx: index('email_idx').on(table.email),
      roleIdx: index('role_idx').on(table.role),
    };
  },
);

// Student additional info
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, {onDelete: 'cascade'})
    .notNull()
    .unique(),
  studentId: varchar('student_id', {length: 50}).notNull().unique(), // Custom student ID
  guardianName: varchar('guardian_name', {length: 255}),
  guardianContact: varchar('guardian_contact', {length: 20}),
  emergencyContact: varchar('emergency_contact', {length: 20}),
  bloodGroup: varchar('blood_group', {length: 10}),
  ...timestamps,
});

// Staff additional info
export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, {onDelete: 'cascade'})
    .notNull()
    .unique(),
  employeeId: varchar('employee_id', {length: 50}).notNull().unique(),
  designation: varchar('designation', {length: 100}),
  department: varchar('department', {length: 100}),
  joiningDate: date('joining_date').notNull(),
  salary: decimal('salary', {precision: 10, scale: 2}),
  ...timestamps,
});

// Batch table (improved)
export const batches = pgTable(
  'batches',
  {
    id: serial('id').primaryKey(),
    batchCode: varchar('batch_code', {length: 50}).notNull().unique(),
    name: varchar('name', {length: 200}).notNull(),
    type: batchTypeEnum('type').notNull(),
    academicYear: integer('academic_year').notNull(),
    maxStudents: integer('max_students').notNull(),
    currentStudents: integer('current_students').default(0).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    batchTime: time('batch_time').notNull(),
    fees: decimal('fees', {precision: 10, scale: 2}).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      typeIdx: index('batch_type_idx').on(table.type),
      yearIdx: index('batch_year_idx').on(table.academicYear),
    };
  },
);

// Batch schedule
export const batchSchedules = pgTable(
  'batch_schedules',
  {
    id: serial('id').primaryKey(),
    batchId: integer('batch_id')
      .references(() => batches.id, {onDelete: 'cascade'})
      .notNull(),
    dayOfWeek: dayEnum('day_of_week').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    room: varchar('room', {length: 50}),
    ...timestamps,
  },
  (table) => {
    return {
      batchDayUnique: unique('batch_day_unique').on(
        table.batchId,
        table.dayOfWeek,
      ),
    };
  },
);

// Batch-Student enrollment
export const enrollments = pgTable(
  'enrollments',
  {
    id: serial('id').primaryKey(),
    batchId: integer('batch_id')
      .references(() => batches.id, {onDelete: 'cascade'})
      .notNull(),
    studentId: integer('student_id')
      .references(() => students.id, {onDelete: 'cascade'})
      .notNull(),
    enrollmentDate: date('enrollment_date').defaultNow().notNull(),
    status: varchar('status', {length: 50}).default('active').notNull(), // active, completed, dropped
    completionDate: date('completion_date'),
    ...timestamps,
  },
  (table) => {
    return {
      batchStudentUnique: unique('batch_student_unique').on(
        table.batchId,
        table.studentId,
      ),
      statusIdx: index('enrollment_status_idx').on(table.status),
    };
  },
);

// Batch-Staff assignment
export const batchStaffAssignments = pgTable(
  'batch_staff_assignments',
  {
    id: serial('id').primaryKey(),
    batchId: integer('batch_id')
      .references(() => batches.id, {onDelete: 'cascade'})
      .notNull(),
    staffId: integer('staff_id')
      .references(() => staff.id, {onDelete: 'cascade'})
      .notNull(),
    role: varchar('role', {length: 50}).notNull(), // instructor, coordinator, assistant
    assignedDate: date('assigned_date').defaultNow().notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      batchStaffUnique: unique('batch_staff_unique').on(
        table.batchId,
        table.staffId,
      ),
    };
  },
);

// Payment plans (for installments)
export const paymentPlans = pgTable('payment_plans', {
  id: serial('id').primaryKey(),
  enrollmentId: integer('enrollment_id')
    .references(() => enrollments.id, {onDelete: 'cascade'})
    .notNull(),
  totalAmount: decimal('total_amount', {precision: 10, scale: 2}).notNull(),
  numberOfInstallments: integer('number_of_installments').notNull(),
  ...timestamps,
});

// Payments
export const payments = pgTable(
  'payments',
  {
    id: serial('id').primaryKey(),
    paymentPlanId: integer('payment_plan_id')
      .references(() => paymentPlans.id, {onDelete: 'cascade'})
      .notNull(),
    installmentNumber: integer('installment_number').notNull(),
    amount: decimal('amount', {precision: 10, scale: 2}).notNull(),
    dueDate: date('due_date').notNull(),
    paidDate: date('paid_date'),
    paymentMethod: paymentMethodEnum('payment_method'),
    transactionId: varchar('transaction_id', {length: 100}),
    status: paymentStatusEnum('status').default('pending').notNull(),
    remarks: text('remarks'),
    ...timestamps,
  },
  (table) => {
    return {
      statusIdx: index('payment_status_idx').on(table.status),
      dueDateIdx: index('payment_due_date_idx').on(table.dueDate),
    };
  },
);

// Exams
export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  batchId: integer('batch_id')
    .references(() => batches.id, {onDelete: 'cascade'})
    .notNull(),
  examType: examTypeEnum('exam_type').notNull(),
  title: varchar('title', {length: 255}).notNull(),
  examDate: date('exam_date').notNull(),
  totalMarks: integer('total_marks').notNull(),
  passingMarks: integer('passing_marks').notNull(),
  duration: integer('duration'), // in minutes
  ...timestamps,
});

// Exam results
export const examResults = pgTable(
  'exam_results',
  {
    id: serial('id').primaryKey(),
    examId: integer('exam_id')
      .references(() => exams.id, {onDelete: 'cascade'})
      .notNull(),
    studentId: integer('student_id')
      .references(() => students.id, {onDelete: 'cascade'})
      .notNull(),
    marksObtained: decimal('marks_obtained', {precision: 5, scale: 2}),
    grade: varchar('grade', {length: 10}),
    remarks: text('remarks'),
    isAbsent: boolean('is_absent').default(false).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      examStudentUnique: unique('exam_student_unique').on(
        table.examId,
        table.studentId,
      ),
    };
  },
);

// Attendance
export const attendance = pgTable(
  'attendance',
  {
    id: serial('id').primaryKey(),
    batchId: integer('batch_id')
      .references(() => batches.id, {onDelete: 'cascade'})
      .notNull(),
    studentId: integer('student_id')
      .references(() => students.id, {onDelete: 'cascade'})
      .notNull(),
    date: date('date').notNull(),
    status: attendanceStatusEnum('status').notNull(),
    remarks: text('remarks'),
    ...timestamps,
  },
  (table) => {
    return {
      attendanceUnique: unique('attendance_unique').on(
        table.batchId,
        table.studentId,
        table.date,
      ),
      dateIdx: index('attendance_date_idx').on(table.date),
    };
  },
);

// Management costs/expenses
export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    expenseType: expenseTypeEnum('expense_type').notNull(),
    description: varchar('description', {length: 500}).notNull(),
    amount: decimal('amount', {precision: 10, scale: 2}).notNull(),
    expenseDate: date('expense_date').notNull(),
    batchId: integer('batch_id').references(() => batches.id, {
      onDelete: 'set null',
    }), // Optional batch association
    staffId: integer('staff_id').references(() => staff.id, {
      onDelete: 'set null',
    }), // Optional staff association
    receiptNumber: varchar('receipt_number', {length: 100}),
    approvedBy: integer('approved_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    ...timestamps,
  },
  (table) => {
    return {
      dateIdx: index('expense_date_idx').on(table.expenseDate),
      typeIdx: index('expense_type_idx').on(table.expenseType),
    };
  },
);

// Notifications (for payment reminders, exam schedules, etc.)
export const notifications = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, {onDelete: 'cascade'})
      .notNull(),
    title: varchar('title', {length: 255}).notNull(),
    message: text('message').notNull(),
    type: varchar('type', {length: 50}).notNull(), // payment_reminder, exam_schedule, announcement
    isRead: boolean('is_read').default(false).notNull(),
    relatedId: integer('related_id'), // ID of related entity (payment, exam, etc.)
    relatedType: varchar('related_type', {length: 50}), // payment, exam, batch
    ...timestamps,
  },
  (table) => {
    return {
      userIdx: index('notification_user_idx').on(table.userId),
      readIdx: index('notification_read_idx').on(table.isRead),
    };
  },
);

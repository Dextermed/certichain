import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { User, University, Student, Diploma } from '@/types';

interface UserRecord extends User {
  passwordHash: string;
}

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'certichain.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    walletAddress TEXT,
    universityId TEXT,
    studentId TEXT,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS universities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    walletAddress TEXT NOT NULL,
    isAuthorized INTEGER NOT NULL DEFAULT 0,
    registeredAt TEXT NOT NULL,
    location TEXT,
    website TEXT
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    walletAddress TEXT NOT NULL,
    universityId TEXT NOT NULL,
    nationalId TEXT,
    verified INTEGER NOT NULL DEFAULT 0,
    registeredAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS diplomas (
    id TEXT PRIMARY KEY,
    diplomaId TEXT UNIQUE NOT NULL,
    studentId TEXT NOT NULL,
    universityId TEXT NOT NULL,
    studentName TEXT NOT NULL,
    universityName TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT NOT NULL,
    graduationDate TEXT NOT NULL,
    cid TEXT NOT NULL,
    diplomaHash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    issuedAt TEXT NOT NULL,
    txHash TEXT
  );
`);

// ---------- helpers ----------

function boolToInt(val: boolean): number {
  return val ? 1 : 0;
}

function rowToUser(row: Record<string, unknown>): UserRecord {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    role: row.role as User['role'],
    walletAddress: (row.walletAddress as string) || undefined,
    universityId: (row.universityId as string) || undefined,
    studentId: (row.studentId as string) || undefined,
    passwordHash: row.passwordHash as string,
    createdAt: row.createdAt as string,
  };
}

function rowToUniversity(row: Record<string, unknown>): University {
  return {
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    walletAddress: row.walletAddress as string,
    isAuthorized: row.isAuthorized === 1,
    registeredAt: row.registeredAt as string,
    location: (row.location as string) || undefined,
    website: (row.website as string) || undefined,
  };
}

function rowToStudent(row: Record<string, unknown>): Student {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    walletAddress: row.walletAddress as string,
    universityId: row.universityId as string,
    nationalId: (row.nationalId as string) || undefined,
    verified: row.verified === 1,
    registeredAt: row.registeredAt as string,
  };
}

function rowToDiploma(row: Record<string, unknown>): Diploma {
  return {
    id: row.id as string,
    diplomaId: row.diplomaId as string,
    studentId: row.studentId as string,
    universityId: row.universityId as string,
    studentName: row.studentName as string,
    universityName: row.universityName as string,
    degree: row.degree as string,
    field: row.field as string,
    graduationDate: row.graduationDate as string,
    cid: row.cid as string,
    diplomaHash: row.diplomaHash as string,
    status: row.status as Diploma['status'],
    issuedAt: row.issuedAt as string,
    txHash: (row.txHash as string) || undefined,
  };
}

// ---------- Users ----------

const insertUserStmt = db.prepare(`
  INSERT INTO users (id, email, name, role, walletAddress, universityId, studentId, passwordHash, createdAt)
  VALUES (@id, @email, @name, @role, @walletAddress, @universityId, @studentId, @passwordHash, @createdAt)
`);

export function createUser(user: UserRecord): UserRecord {
  insertUserStmt.run({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    walletAddress: user.walletAddress ?? null,
    universityId: user.universityId ?? null,
    studentId: user.studentId ?? null,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt,
  });
  return user;
}

export function getUserByEmail(email: string): UserRecord | undefined {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as Record<string, unknown> | undefined;
  return row ? rowToUser(row) : undefined;
}

export function getUserById(id: string): UserRecord | undefined {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToUser(row) : undefined;
}

export function getAllUsers(): UserRecord[] {
  const rows = db.prepare('SELECT * FROM users').all() as Record<string, unknown>[];
  return rows.map(rowToUser);
}

// ---------- Universities ----------

const insertUniversityStmt = db.prepare(`
  INSERT INTO universities (id, name, address, walletAddress, isAuthorized, registeredAt, location, website)
  VALUES (@id, @name, @address, @walletAddress, @isAuthorized, @registeredAt, @location, @website)
`);

export function addUniversity(university: University): University {
  insertUniversityStmt.run({
    id: university.id,
    name: university.name,
    address: university.address,
    walletAddress: university.walletAddress,
    isAuthorized: boolToInt(university.isAuthorized),
    registeredAt: university.registeredAt,
    location: university.location ?? null,
    website: university.website ?? null,
  });
  return university;
}

export function getUniversityById(id: string): University | undefined {
  const row = db.prepare('SELECT * FROM universities WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToUniversity(row) : undefined;
}

export function getAllUniversities(): University[] {
  const rows = db.prepare('SELECT * FROM universities').all() as Record<string, unknown>[];
  return rows.map(rowToUniversity);
}

export function updateUniversity(id: string, data: Partial<University>): University | undefined {
  const existing = getUniversityById(id);
  if (!existing) return undefined;

  const updated = { ...existing, ...data };
  db.prepare(`
    UPDATE universities
    SET name = @name, address = @address, walletAddress = @walletAddress,
        isAuthorized = @isAuthorized, registeredAt = @registeredAt,
        location = @location, website = @website
    WHERE id = @id
  `).run({
    id: updated.id,
    name: updated.name,
    address: updated.address,
    walletAddress: updated.walletAddress,
    isAuthorized: boolToInt(updated.isAuthorized),
    registeredAt: updated.registeredAt,
    location: updated.location ?? null,
    website: updated.website ?? null,
  });
  return updated;
}

// ---------- Students ----------

const insertStudentStmt = db.prepare(`
  INSERT INTO students (id, name, email, walletAddress, universityId, nationalId, verified, registeredAt)
  VALUES (@id, @name, @email, @walletAddress, @universityId, @nationalId, @verified, @registeredAt)
`);

export function addStudent(student: Student): Student {
  insertStudentStmt.run({
    id: student.id,
    name: student.name,
    email: student.email,
    walletAddress: student.walletAddress,
    universityId: student.universityId,
    nationalId: student.nationalId ?? null,
    verified: boolToInt(student.verified),
    registeredAt: student.registeredAt,
  });
  return student;
}

export function getStudentById(id: string): Student | undefined {
  const row = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToStudent(row) : undefined;
}

export function getStudentsByUniversity(universityId: string): Student[] {
  const rows = db.prepare('SELECT * FROM students WHERE universityId = ?').all(universityId) as Record<string, unknown>[];
  return rows.map(rowToStudent);
}

export function getAllStudents(): Student[] {
  const rows = db.prepare('SELECT * FROM students').all() as Record<string, unknown>[];
  return rows.map(rowToStudent);
}

// ---------- Diplomas ----------

const insertDiplomaStmt = db.prepare(`
  INSERT INTO diplomas (id, diplomaId, studentId, universityId, studentName, universityName, degree, field, graduationDate, cid, diplomaHash, status, issuedAt, txHash)
  VALUES (@id, @diplomaId, @studentId, @universityId, @studentName, @universityName, @degree, @field, @graduationDate, @cid, @diplomaHash, @status, @issuedAt, @txHash)
`);

export function addDiploma(diploma: Diploma): Diploma {
  insertDiplomaStmt.run({
    id: diploma.id,
    diplomaId: diploma.diplomaId,
    studentId: diploma.studentId,
    universityId: diploma.universityId,
    studentName: diploma.studentName,
    universityName: diploma.universityName,
    degree: diploma.degree,
    field: diploma.field,
    graduationDate: diploma.graduationDate,
    cid: diploma.cid,
    diplomaHash: diploma.diplomaHash,
    status: diploma.status,
    issuedAt: diploma.issuedAt,
    txHash: diploma.txHash ?? null,
  });
  return diploma;
}

export function getDiplomaById(id: string): Diploma | undefined {
  const row = db.prepare('SELECT * FROM diplomas WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToDiploma(row) : undefined;
}

export function getDiplomaByDiplomaId(diplomaId: string): Diploma | undefined {
  const row = db.prepare('SELECT * FROM diplomas WHERE diplomaId = ?').get(diplomaId) as Record<string, unknown> | undefined;
  return row ? rowToDiploma(row) : undefined;
}

export function getDiplomasByStudent(studentId: string): Diploma[] {
  const rows = db.prepare('SELECT * FROM diplomas WHERE studentId = ?').all(studentId) as Record<string, unknown>[];
  return rows.map(rowToDiploma);
}

export function getDiplomasByUniversity(universityId: string): Diploma[] {
  const rows = db.prepare('SELECT * FROM diplomas WHERE universityId = ?').all(universityId) as Record<string, unknown>[];
  return rows.map(rowToDiploma);
}

export function getAllDiplomas(): Diploma[] {
  const rows = db.prepare('SELECT * FROM diplomas').all() as Record<string, unknown>[];
  return rows.map(rowToDiploma);
}

export function updateDiploma(id: string, data: Partial<Diploma>): Diploma | undefined {
  const existing = getDiplomaById(id);
  if (!existing) return undefined;

  const updated = { ...existing, ...data };
  db.prepare(`
    UPDATE diplomas
    SET diplomaId = @diplomaId, studentId = @studentId, universityId = @universityId,
        studentName = @studentName, universityName = @universityName, degree = @degree,
        field = @field, graduationDate = @graduationDate, cid = @cid,
        diplomaHash = @diplomaHash, status = @status, issuedAt = @issuedAt, txHash = @txHash
    WHERE id = @id
  `).run({
    id: updated.id,
    diplomaId: updated.diplomaId,
    studentId: updated.studentId,
    universityId: updated.universityId,
    studentName: updated.studentName,
    universityName: updated.universityName,
    degree: updated.degree,
    field: updated.field,
    graduationDate: updated.graduationDate,
    cid: updated.cid,
    diplomaHash: updated.diplomaHash,
    status: updated.status,
    issuedAt: updated.issuedAt,
    txHash: updated.txHash ?? null,
  });
  return updated;
}

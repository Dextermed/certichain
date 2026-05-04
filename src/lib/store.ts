import type { User, University, Student, Diploma } from '@/types';

interface UserRecord extends User {
  passwordHash: string;
}

const users: Map<string, UserRecord> = new Map();
const universities: Map<string, University> = new Map();
const students: Map<string, Student> = new Map();
const diplomas: Map<string, Diploma> = new Map();

// Users
export function createUser(user: UserRecord): UserRecord {
  users.set(user.id, user);
  return user;
}

export function getUserByEmail(email: string): UserRecord | undefined {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return undefined;
}

export function getUserById(id: string): UserRecord | undefined {
  return users.get(id);
}

export function getAllUsers(): UserRecord[] {
  return Array.from(users.values());
}

// Universities
export function addUniversity(university: University): University {
  universities.set(university.id, university);
  return university;
}

export function getUniversityById(id: string): University | undefined {
  return universities.get(id);
}

export function getAllUniversities(): University[] {
  return Array.from(universities.values());
}

export function updateUniversity(id: string, data: Partial<University>): University | undefined {
  const uni = universities.get(id);
  if (!uni) return undefined;
  const updated = { ...uni, ...data };
  universities.set(id, updated);
  return updated;
}

// Students
export function addStudent(student: Student): Student {
  students.set(student.id, student);
  return student;
}

export function getStudentById(id: string): Student | undefined {
  return students.get(id);
}

export function getStudentsByUniversity(universityId: string): Student[] {
  return Array.from(students.values()).filter(s => s.universityId === universityId);
}

export function getAllStudents(): Student[] {
  return Array.from(students.values());
}

// Diplomas
export function addDiploma(diploma: Diploma): Diploma {
  diplomas.set(diploma.id, diploma);
  return diploma;
}

export function getDiplomaById(id: string): Diploma | undefined {
  return diplomas.get(id);
}

export function getDiplomaByDiplomaId(diplomaId: string): Diploma | undefined {
  for (const d of diplomas.values()) {
    if (d.diplomaId === diplomaId) return d;
  }
  return undefined;
}

export function getDiplomasByStudent(studentId: string): Diploma[] {
  return Array.from(diplomas.values()).filter(d => d.studentId === studentId);
}

export function getDiplomasByUniversity(universityId: string): Diploma[] {
  return Array.from(diplomas.values()).filter(d => d.universityId === universityId);
}

export function getAllDiplomas(): Diploma[] {
  return Array.from(diplomas.values());
}

export function updateDiploma(id: string, data: Partial<Diploma>): Diploma | undefined {
  const diploma = diplomas.get(id);
  if (!diploma) return undefined;
  const updated = { ...diploma, ...data };
  diplomas.set(id, updated);
  return updated;
}

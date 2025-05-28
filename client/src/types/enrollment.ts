import type { IUser } from "./auth";
import type { ICourse } from "./course";

export interface IEnrollmentRegister {
  courseId: string;
  bi: File;
  certf: File;
  photo: File;
  token: string;
}

export interface IFiles {
  id: string;
  fileName: string;
  type: string;
  downloadLink: string;
}

export interface IStudent {
  id: string;
  name?: string;
  email?: string;
  bi?: string;
  phoneNumber?: string;
}

export interface IEnrollment {
  id: string;
  course: ICourse;
  status: string;
  files: IFiles[];
  student: IStudent;
  processedAt?: string,
  createdAt: string;
}

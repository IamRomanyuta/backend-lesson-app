export interface LessonResponse {
  id: number;
  date: string;
  title: string;
  status: number;
  visitCount: number;
  students: Array<StudentInfo>;
  teachers: Array<TeacherInfo>;
}

export interface StudentInfo {
  id: number;
  name: string;
  visit: boolean;
}

export interface TeacherInfo {
  id: number;
  name: string;
}

export interface LessonQueryParams {
  date?: string;
  status?: string;
  teacherIds?: string;
  studentsCount?: string;
  page?: string;
  lessonsPerPage?: string;
}

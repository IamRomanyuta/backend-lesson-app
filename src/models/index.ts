import sequelize from '../config/database';
import { Lesson } from './Lesson';
import { Teacher } from './Teacher';
import { Student } from './Student';
import { LessonStudent } from './LessonStudent';
import { LessonTeacher } from './LessonTeacher';

Lesson.belongsToMany(Teacher, { through: LessonTeacher, foreignKey: 'lessonId', as: 'teachers' });
Teacher.belongsToMany(Lesson, { through: LessonTeacher, foreignKey: 'teacherId', as: 'lessons' });

Lesson.belongsToMany(Student, { through: LessonStudent, foreignKey: 'lessonId', as: 'students' });
Student.belongsToMany(Lesson, { through: LessonStudent, foreignKey: 'studentId', as: 'lessons' });

export { sequelize, Lesson, Teacher, Student, LessonStudent, LessonTeacher };

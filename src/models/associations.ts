import { Lesson } from './Lesson';
import { Teacher } from './Teacher';
import { Student } from './Student';
import { LessonStudent } from './LessonStudent';
import { LessonTeacher } from './LessonTeacher';

Lesson.belongsToMany(Teacher, { 
  through: LessonTeacher, 
  foreignKey: 'lesson_id',
  otherKey: 'teacher_id',
  as: 'teachers' 
});

Teacher.belongsToMany(Lesson, { 
  through: LessonTeacher, 
  foreignKey: 'teacher_id',
  otherKey: 'lesson_id', 
  as: 'lessons' 
});

Lesson.belongsToMany(Student, { 
  through: LessonStudent, 
  foreignKey: 'lesson_id',
  otherKey: 'student_id',
  as: 'students' 
});

Student.belongsToMany(Lesson, { 
  through: LessonStudent, 
  foreignKey: 'student_id',
  otherKey: 'lesson_id',
  as: 'lessons' 
});

LessonStudent.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
LessonStudent.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

LessonTeacher.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
LessonTeacher.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

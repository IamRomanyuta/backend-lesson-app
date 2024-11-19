import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Lesson } from './Lesson';
import { Student } from './Student';

class LessonStudent extends Model {
  public lessonId!: number;
  public studentId!: number;
  public visit!: boolean;
}

LessonStudent.init({
  lessonId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Lesson,
      key: 'id',
    },
    allowNull: false,
    field: 'lesson_id',
  },
  studentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Student,
      key: 'id',
    },
    allowNull: false,
    field: 'student_id',
  },
  visit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'LessonStudent',
  tableName: 'lesson_students',
  timestamps: false,
});

LessonStudent.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });
LessonStudent.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

export { LessonStudent };

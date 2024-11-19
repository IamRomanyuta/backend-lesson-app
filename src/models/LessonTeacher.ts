import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Lesson } from './Lesson';
import { Teacher } from './Teacher';

class LessonTeacher extends Model {
  public lessonId!: number;
  public teacherId!: number;
}

LessonTeacher.init({
  lessonId: {
    type: DataTypes.INTEGER,
    references: {
      model: Lesson,
      key: 'id',
    },
    allowNull: false,
    primaryKey: true,
    field: 'lesson_id',
  },
  teacherId: {
    type: DataTypes.INTEGER,
    references: {
      model: Teacher,
      key: 'id',
    },
    allowNull: false,
    primaryKey: true,
    field: 'teacher_id',
  },
}, {
  sequelize,
  modelName: 'LessonTeacher',
  tableName: 'lesson_teachers',
  timestamps: false,
});

export { LessonTeacher };


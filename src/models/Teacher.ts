import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Lesson } from './Lesson';
import { LessonTeacher } from './LessonTeacher';

class Teacher extends Model {
  public id!: number;
  public name!: string;

  public readonly lessons?: Lesson[];
  public lessonTeacher?: LessonTeacher;
}

Teacher.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}, {
  sequelize,
  modelName: 'Teacher',
  tableName: 'teachers',
  timestamps: false,
});

export { Teacher };

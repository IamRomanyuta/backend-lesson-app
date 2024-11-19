import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Lesson } from './Lesson';
import { LessonStudent } from './LessonStudent';

class Student extends Model {
  public id!: number;
  public name!: string;

  public readonly lessons?: Lesson[];
  public lessonStudent?: LessonStudent;
}

Student.init({
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
  modelName: 'Student',
  tableName: 'students',
  timestamps: false,
});

export { Student };

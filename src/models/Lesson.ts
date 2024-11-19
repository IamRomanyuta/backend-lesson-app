import { DataTypes, Model, Association, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database';
import { Student } from './Student';
import { Teacher } from './Teacher';

class Lesson extends Model {
  public id!: number;
  public date!: string;
  public title!: string;
  public status!: number;

  public readonly students?: Student[];
  public readonly teachers?: Teacher[];

  public getStudents!: HasManyGetAssociationsMixin<Student>;
  public getTeachers!: HasManyGetAssociationsMixin<Teacher>;

  public static associations: {
    students: Association<Lesson, Student>;
    teachers: Association<Lesson, Teacher>;
  };
}

Lesson.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255],
    },
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[0, 1]],
    },
  },
}, {
  sequelize,
  modelName: 'Lesson',
  tableName: 'lessons',
  timestamps: false,
});

export { Lesson };

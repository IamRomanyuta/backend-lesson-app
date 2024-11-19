import { Request, Response, NextFunction } from 'express';
import { Op, Includeable, WhereOptions } from 'sequelize';
import { Lesson } from '../models/Lesson';
import { Teacher } from '../models/Teacher';
import { Student } from '../models/Student';
import { LessonResponse, LessonQueryParams } from '../interfaces/lessonInterfaces';
import logger from '../utils/logger';

const getWhereCondition = (query: LessonQueryParams): WhereOptions => {
  const where: WhereOptions = {};
  const { date, status } = query;

  if (date) {
    const dates = date.split(',');
    if (dates.length === 1) {
      where.date = dates[0];
    } else if (dates.length === 2) {
      where.date = { [Op.between]: [dates[0], dates[1]] };
    }
  }

  if (status !== undefined) {
    where.status = parseInt(status, 10);
  }

  logger.info(`Generated WHERE condition: ${JSON.stringify(where)}`);
  return where;
};

export const getLessons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { teacherIds, studentsCount, page = '1', lessonsPerPage = '5' } = req.query as LessonQueryParams;

    const parsedPage = parseInt(page, 10);
    const parsedLessonsPerPage = parseInt(lessonsPerPage, 10);
    
    if (parsedPage <= 0 || parsedLessonsPerPage <= 0) {
      logger.warn('Invalid page or lessonsPerPage value.');
      res.status(400).json({ error: 'Page and lessonsPerPage must be positive integers.' });
      return;
    }

    const where = getWhereCondition(req.query as LessonQueryParams);
    const include: Includeable[] = [];

    if (teacherIds) {
      const teacherIdsArray = teacherIds.split(',').map((id) => parseInt(id, 10));
      if (teacherIdsArray.some(isNaN)) {
        logger.warn('Invalid teacher IDs provided.');
        res.status(400).json({ error: 'Teacher IDs must be valid integers.' });
        return;
      }
      include.push({
        model: Teacher,
        as: 'teachers',
        where: { id: { [Op.in]: teacherIdsArray } },
        through: {
          attributes: [],
        },
      });
    } else {
      include.push({
        model: Teacher,
        as: 'teachers',
        through: {
          attributes: [],
        },
      });
    }

    include.push({
      model: Student,
      as: 'students',
      through: {
        attributes: ['visit'],
      },
    });

    logger.info(`Executing Lesson.findAll with where: ${JSON.stringify(where)} and include: ${JSON.stringify(include)}`);

    const offset = (parsedPage - 1) * parsedLessonsPerPage;
    const limit = parsedLessonsPerPage;

    const lessons = await Lesson.findAll({ where, include, offset, limit });

    let filteredLessons = lessons;
    if (studentsCount) {
      const countRange = studentsCount.split(',').map((count) => parseInt(count, 10));
      if (countRange.some(isNaN)) {
        logger.warn('Invalid studentsCount value provided.');
        res.status(400).json({ error: 'studentsCount must be valid integers.' });
        return;
      }

      filteredLessons = lessons.filter((lesson) => {
        const studentCount = lesson.students ? lesson.students.length : 0;
        if (countRange.length === 1) {
          return studentCount === countRange[0];
        } else if (countRange.length === 2) {
          return studentCount >= countRange[0] && studentCount <= countRange[1];
        }
        return false;
      });
    }

    if (filteredLessons.length === 0) {
      logger.info('No lessons found for the given criteria.');
      res.status(404).json({ message: 'No lessons found.' });
      return;
    }

    const response: LessonResponse[] = filteredLessons.map((lesson) => ({
      id: lesson.id,
      date: lesson.date,
      title: lesson.title,
      status: lesson.status,
      visitCount: lesson.students ? lesson.students.filter((student) => student.lessonStudent?.visit).length : 0,
      students: lesson.students ? lesson.students.map((student) => ({
        id: student.id,
        name: student.name,
        visit: student.lessonStudent?.visit || false,
      })) : [],
      teachers: lesson.teachers ? lesson.teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
      })) : [],
    }));

    logger.info(`Lessons retrieved successfully. Count: ${response.length}`);
    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error retrieving lessons: ${error.message}`);
      res.status(500).json({ error: error.message });
    } else {
      logger.error('Error retrieving lessons: Unknown error');
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};


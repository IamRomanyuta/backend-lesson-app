import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../utils/logger';
import { LessonResponse, LessonQueryParams } from '../interfaces/lessonInterfaces';

const prisma = new PrismaClient();

const getLessons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { teacherIds, studentsCount, page = '1', lessonsPerPage = '5', date, status } = req.query as LessonQueryParams;

    const parsedPage = parseInt(page, 10);
    const parsedLessonsPerPage = parseInt(lessonsPerPage, 10);

    if (parsedPage <= 0 || parsedLessonsPerPage <= 0) {
      logger.warn('Invalid page or lessonsPerPage value.');
      res.status(400).json({ error: 'Page and lessonsPerPage must be positive integers.' });
      return;
    }

    const where: Prisma.LessonWhereInput = {};

    if (date) {
      const dates = date.split(',');
      if (dates.length === 1) {
        where.date = new Date(dates[0]);
      } else if (dates.length === 2) {
        where.date = {
          gte: new Date(dates[0]),
          lte: new Date(dates[1]),
        };
      }
    }

    if (status !== undefined) {
      where.status = parseInt(status, 10);
    }

    if (teacherIds) {
      const teacherIdsArray = teacherIds.split(',').map((id) => parseInt(id, 10));
      if (teacherIdsArray.some(isNaN)) {
        logger.warn('Invalid teacher IDs provided.');
        res.status(400).json({ error: 'Teacher IDs must be valid integers.' });
        return;
      }
      where.lessonTeachers = {
        some: {
          teacherId: { in: teacherIdsArray },
        },
      };
    }

    const skip = (parsedPage - 1) * parsedLessonsPerPage;
    const take = parsedLessonsPerPage;

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        lessonTeachers: {
          include: {
            teacher: true,
          },
        },
        lessonStudents: {
          include: {
            student: true,
          },
        },
      },
      skip,
      take,
    });

    let filteredLessons = lessons;

    if (studentsCount) {
      const countRange = studentsCount.split(',').map((count) => parseInt(count, 10));
      if (countRange.some(isNaN)) {
        logger.warn('Invalid studentsCount value provided.');
        res.status(400).json({ error: 'studentsCount must be valid integers.' });
        return;
      }

      filteredLessons = lessons.filter((lesson) => {
        const studentCount = lesson.lessonStudents.length;
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
      date: lesson.date.toISOString().split('T')[0],
      title: lesson.title ?? '',
      status: lesson.status ?? 0,
      visitCount: lesson.lessonStudents.filter((ls) => ls.visit).length,
      students: lesson.lessonStudents.map((ls) => ({
        id: ls.student.id,
        name: ls.student.name ?? '', // Если имя `null`, заменить на пустую строку
        visit: ls.visit,
      })),
      teachers: lesson.lessonTeachers.map((lt) => ({
        id: lt.teacher.id,
        name: lt.teacher.name ?? '', // Если имя `null`, заменить на пустую строку
      })),
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

export { getLessons };

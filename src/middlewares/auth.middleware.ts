import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { JWT_SECRET } from '@/config';

const authMiddleware = async (
  req: RequestWithUser,
  _: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.cookies['Authorization'] ||
      (req.header('Authorization')
        ? req.header('Authorization').split('Bearer ')[1]
        : null);

    if (Authorization) {
      const secretKey: string = JWT_SECRET;
      const verificationResponse = verify(
        Authorization,
        secretKey
      ) as DataStoredInToken;
      const userId = verificationResponse.id;

      const users = new PrismaClient().user;
      const findUser = await users.findUnique({
        where: { id: Number(userId) },
      });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Token de autenticação inválido'));
      }
    } else {
      next(new HttpException(404, 'Token de autenticação não foi informado'));
    }
  } catch (error) {
    next(new HttpException(401, 'Token de autenticação inválido'));
  }
};

export default authMiddleware;
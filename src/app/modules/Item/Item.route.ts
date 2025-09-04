import express, { NextFunction, Request, Response } from 'express';
import { ItemControllers } from './Item.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createItemValidationSchema, updateItemValidationSchema } from './Item.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-item',
    auth(USER_ROLE.superAdmin),
    uploadFileS3(true).single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
          try {
            req.body = JSON.parse(req.body.data);
          } catch (error) {
            next(error);
          }
        }
        next();
      },
  validateRequest(createItemValidationSchema),
  ItemControllers.createItem,
);

router.get(
  '/:id',
  ItemControllers.getSingleItem,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
    uploadFileS3(true).single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
          try {
            req.body = JSON.parse(req.body.data);
          } catch (error) {
            next(error);
          }
        }
        next();
      },
  validateRequest(updateItemValidationSchema),
  ItemControllers.updateItem,
);

router.delete(
  '/:id',
  ItemControllers.deleteItem,
);

router.get(
  '/',
  ItemControllers.getAllItems,
);

export const ItemRoutes = router;

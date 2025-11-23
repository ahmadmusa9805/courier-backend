/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ItemServices } from './Item.service';

const createItem = catchAsync(async (req, res) => {
  const ItemData = req.body;
  const result = await ItemServices.createItemIntoDB(ItemData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item is created successfully',
    data: result,
  });
});

const getSingleItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ItemServices.getSingleItemFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item is retrieved successfully',
    data: result,
  });
});

const getAllItems = catchAsync(async (req, res) => {
  const result = await ItemServices.getAllItemsFromDB(req.query);

  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: 'Items are retrieved successfully',
  //   meta: result.meta,
  //   allItemsWithStats: result.allItemsWithStats,
  //   data: result.result,
  // } as any);

    res.status(200).json({
    success: true,
    message: 'test',
    meta: result.meta,
    allItemsWithStats: result.allItemsWithStats,
    data: result.result,
  } as any);
});

const updateItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Item = req.body;
  const result = await ItemServices.updateItemIntoDB(id, Item, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item is updated successfully',
    data: result,
  });
});

const deleteItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ItemServices.deleteItemFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item is deleted successfully',
    data: result,
  });
});

export const ItemControllers = {
  createItem,
  getSingleItem,
  getAllItems,
  updateItem,
  deleteItem,
};

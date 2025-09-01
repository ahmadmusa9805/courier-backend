import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TermServices } from './Term.service';

const createTerm = catchAsync(async (req, res) => {
  const { term: TermData } = req.body;
  const result = await TermServices.createTermIntoDB(TermData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Term is created successfully',
    data: result,
  });
});

const getSingleTerm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TermServices.getSingleTermFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Term is retrieved successfully',
    data: result,
  });
});

const getAllTerms = catchAsync(async (req, res) => {
  const result = await TermServices.getAllTermsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terms are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateTerm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { term} = req.body;
  const result = await TermServices.updateTermIntoDB(id, term);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Term is updated successfully',
    data: result,
  });
});

const deleteTerm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TermServices.deleteTermFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Term is deleted successfully',
    data: result,
  });
});

export const TermControllers = {
  createTerm,
  getSingleTerm,
  getAllTerms,
  updateTerm,
  deleteTerm,
};

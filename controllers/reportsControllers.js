import {
  getMonthlyReportServices,
  getCategoryReportServices,
  getExecutiveSummaryServices
} from "../services/reportsServices.js";
import { successResponse } from "../utils/responseHandler.js";

export const getMonthlyReportController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getMonthlyReportServices(userId, req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryReportController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getCategoryReportServices(userId, req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getExecutiveSummaryController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getExecutiveSummaryServices(userId, req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
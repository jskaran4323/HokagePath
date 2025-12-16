import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import fitnessProfileService, { FitnessProfileServiceError } from '../services/fitnessProfileService';
import { UpdateFitnessProfileDTO, AddWeightEntryDTO } from '../../types/fitnessProfile.dto';
import { validateUpdateFitnessProfile, validateAddWeightEntry } from '../../utils/fitnessProfileValidation';


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getFitnessProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const profile = await fitnessProfileService.getFitnessProfile(userId);

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error: any) {
    if (error instanceof FitnessProfileServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Get fitness profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fitness profile',
      error: error.message
    });
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const updateFitnessProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const updateData: UpdateFitnessProfileDTO = req.body;

    const validationErrors = validateUpdateFitnessProfile(updateData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const profile = await fitnessProfileService.updateFitnessProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Fitness profile updated successfully',
      data: profile
    });

  } catch (error: any) {
    if (error instanceof FitnessProfileServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Update fitness profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating fitness profile',
      error: error.message
    });
  }
};

export const addWeightEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const weightData: AddWeightEntryDTO = req.body;

    const validationErrors = validateAddWeightEntry(weightData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const profile = await fitnessProfileService.addWeightEntry(userId, weightData);

    res.status(200).json({
      success: true,
      message: 'Weight entry added successfully',
      data: profile
    });

  } catch (error: any) {
    if (error instanceof FitnessProfileServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Add weight entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding weight entry',
      error: error.message
    });
  }
};


import FitnessProfileModel from '../../models/FitnessProfile';
import { UpdateFitnessProfileDTO, AddWeightEntryDTO, FitnessProfileResponseDTO } from '../../types/fitnessProfile.dto';

export class FitnessProfileServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'FitnessProfileServiceError';
  }
}

export class FitnessProfileService {

  private toFitnessProfileResponse(profile: any): FitnessProfileResponseDTO {
    return {
      id: profile._id.toString(),
      userId: profile.userId.toString(),
      fitnessGoal: profile.fitnessGoal,
      currentWeight: profile.currentWeight,
      targetWeight: profile.targetWeight,
      height: profile.height,
      heightUnit: profile.heightUnit,
      weightUnit: profile.weightUnit,
      age: profile.age,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      experienceLevel: profile.experienceLevel,
      preferredWorkoutTypes: profile.preferredWorkoutTypes,
      availableEquipment: profile.availableEquipment,
      workoutDuration: profile.workoutDuration,
      workoutsPerWeek: profile.workoutsPerWeek,
      injuries: profile.injuries,
      dietaryRestrictions: profile.dietaryRestrictions,
      weightHistory: profile.weightHistory,
      bmi: profile.bmi,
      bmr: profile.bmr,
      dailyCalorieTarget: profile.dailyCalorieTarget,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };
  }

  async getFitnessProfile(userId: string): Promise<FitnessProfileResponseDTO> {
    const profile = await FitnessProfileModel.findOne({ userId });

    if (!profile) {
      throw new FitnessProfileServiceError('Fitness profile not found', 404);
    }

    return this.toFitnessProfileResponse(profile);
  }

  async updateFitnessProfile(userId: string, data: UpdateFitnessProfileDTO): Promise<FitnessProfileResponseDTO> {
    const profile = await FitnessProfileModel.findOne({ userId });

    if (!profile) {
      throw new FitnessProfileServiceError('Fitness profile not found', 404);
    }

    Object.assign(profile, data);

    if (profile.height > 0 && profile.currentWeight > 0) {
      profile.bmi = this.calculateBMI(profile.currentWeight, profile.height, profile.heightUnit, profile.weightUnit);
    }

    if (profile.currentWeight > 0 && profile.height > 0 && profile.age > 0 && profile.gender) {
      profile.bmr = this.calculateBMR(profile.currentWeight, profile.height, profile.age, profile.gender, profile.heightUnit, profile.weightUnit);
      profile.dailyCalorieTarget = this.calculateDailyCalories(profile.bmr, profile.activityLevel, profile.fitnessGoal);
    }

    await profile.save();

    return this.toFitnessProfileResponse(profile);
  }

  async addWeightEntry(userId: string, data: AddWeightEntryDTO): Promise<FitnessProfileResponseDTO> {
    const profile = await FitnessProfileModel.findOne({ userId });

    if (!profile) {
      throw new FitnessProfileServiceError('Fitness profile not found', 404);
    }

    profile.weightHistory.push({
      weight: data.weight,
      date: data.date || new Date(),
      note: data.note
    });

    profile.currentWeight = data.weight;

    if (profile.height > 0) {
      profile.bmi = this.calculateBMI(profile.currentWeight, profile.height, profile.heightUnit, profile.weightUnit);
    }

    await profile.save();

    return this.toFitnessProfileResponse(profile);
  }

  private calculateBMI(weight: number, height: number, heightUnit: string, weightUnit: string): number {
    let weightInKg = weight;
    let heightInM = height / 100;

    if (weightUnit === 'lbs') {
      weightInKg = weight * 0.453592;
    }

    if (heightUnit === 'inches') {
      heightInM = (height * 2.54) / 100;
    }

    const bmi = weightInKg / (heightInM * heightInM);
    return Math.round(bmi * 10) / 10;
  }

  private calculateBMR(weight: number, height: number, age: number, gender: string, heightUnit: string, weightUnit: string): number {
    let weightInKg = weight;
    let heightInCm = height;

    if (weightUnit === 'lbs') {
      weightInKg = weight * 0.453592;
    }

    if (heightUnit === 'inches') {
      heightInCm = height * 2.54;
    }

    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else if (gender === 'female') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 78;
    }

    return Math.round(bmr);
  }

  private calculateDailyCalories(bmr: number, activityLevel: string, fitnessGoal: string): number {
    const activityMultipliers: any = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      super_active: 1.9
    };

    let tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

    if (fitnessGoal === 'weight_loss') {
      tdee -= 500;
    } else if (fitnessGoal === 'muscle_gain') {
      tdee += 300;
    }

    return Math.round(tdee);
  }
}

export default new FitnessProfileService();
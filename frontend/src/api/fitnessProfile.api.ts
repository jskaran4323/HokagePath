import apiClient from "./client";

import type { FitnessProfile } from "../types/auth.types";
import type { AddWeightEntry } from "../types/weightEntry.types";

export interface UpdateFitnessProfileData {
    fitnessGoal?: string;
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    age?: number;
    gender?: string;
    activityLevel?: string;
    experienceLevel?: string;
    availableEquipment?: string[];
    workoutDuration?: number;
    workoutsPerWeek?: number;
    injuries?: string[];
    dietaryRestrictions?: string[];
  }
  

export const FitnessProfileApi = {
    update: (data: UpdateFitnessProfileData) =>{
        return apiClient.put<FitnessProfile>("/fitness-profile", data)
    },
    getFitnessProfile: () =>{
       return apiClient.get<FitnessProfile>('/fitness-profile')
    },
    addWeightEntry: (data: AddWeightEntry)=>{
        return apiClient.post<AddWeightEntry>('/fitness-profile/weight', data)
    }

}    
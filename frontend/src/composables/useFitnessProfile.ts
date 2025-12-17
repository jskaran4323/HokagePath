/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { FitnessProfileApi, type UpdateFitnessProfileData } from "../api/fitnessProfile.api";
import { useAuthStore } from "../store/authStore";


export const useFitnessProfile = () =>{
    const navigate  =  useNavigate();

    const store = useAuthStore();


    const updateFitnessProfile = async (data: UpdateFitnessProfileData) =>{
            store.reset();
            store.setLoading(true);

            try{
                const response = await  FitnessProfileApi.update(data);
                store.setProfile(response.data)
                navigate('/dashboard');
                return {success : true}     
            }
            catch(err: any) {
                const errorMessage = err.response?.data?.message || 'update FitnessProfile failed';
                store.setError(errorMessage);
                return { success: false, error: errorMessage };
            }finally {
                store.setLoading(false);
            }

    }
    const getFitnessProfile = async () =>{
        
        store.setLoading(true);
        try{
            const response = await FitnessProfileApi.getFitnessProfile();
            store.setProfile(response.data);
            return{success: true}
        }catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch fitness profile';
            store.setError(errorMessage);
            return { success: false, error: errorMessage };
          } finally {
            store.setLoading(false);
          }
    }

    // const addWeightEntry = async (weight: number, note?: string) => {
    //     store.setLoading(true);
    
    //     try {
    //       const response = await FitnessProfileApi.addWeightEntry({ weight, note });
    //       store.setProfile(response.data);
    //       return { success: true };
    //     } catch (err: any) {
    //       const errorMessage = err.response?.data?.message || 'Failed to add weight entry';
    //       store.setError(errorMessage);
    //       return { success: false, error: errorMessage };
    //     } finally {
    //       store.setLoading(false);
    //     }
    //   };
  return {
    FitnessProfile: store.fitnessProfile,
    isLoading: store.isLoading,
    error: store.error,
    updateFitnessProfile,
    getFitnessProfile,
    //addWeightEntry,
    clearError: () => store.setError(null)
  };
};
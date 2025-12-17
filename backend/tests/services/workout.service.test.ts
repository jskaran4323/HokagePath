import UserModel from "../../src/models/User";
import WorkoutModel from "../../src/models/Workout"
import { CreateWorkoutDTO } from "../../src/types/workout.dto";
import { WorkoutService } from "../../src/v1/services/workoutService"
import mongoose from "mongoose";
jest.mock("../../src/models/Workout")

const regsiterWorkoutData = {
    title: "Mock workout",
      description:"A simple mock workout", 
      workoutType: "strength",
      exercises:[ {
        name: "mock exercise",
        sets: 5,
        reps: 8,
      },
      {
        name: "mock exercise 2",
        sets: 7,
        reps: 7,
      }
    ],
      duration: 20,
      caloriesBurned: 0,
      workoutDate: new Date(),
      difficulty: 5,
      tags: ["1", "2"],     
      status: "scheduled"  
    };




describe("Workout service test", ()=>{
const service = new WorkoutService();
afterEach(()=>{
    jest.clearAllMocks()
})

it("Should create a workout plan", async()=>{
    (WorkoutModel.findOne as jest.Mock).mockRejectedValue(null);
    
    const userId = "user1234";
    const mockWorkOut = {
      title: "Mock workout",
      description: "A simple mock workout",
      workoutType: "strength" as "strength",
      exercises: [
        { name: "mock exercise", sets: 5, reps: 8 },
        { name: "mock exercise 2", sets: 7, reps: 7 }
      ],
      duration: 20,
      caloriesBurned: 0,
      workoutDate: new Date(),
      difficulty: 5,
      tags: ["1", "2"],
      status: "scheduled"
    };

    const workoutFromDb = {
        _id: new mongoose.Types.ObjectId(),
        userId,
        ...mockWorkOut,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    (WorkoutModel.create as jest.Mock).mockResolvedValue(workoutFromDb);
    const result = await service.createWorkout( userId, mockWorkOut)
    
    
    expect(WorkoutModel.create).toHaveBeenCalled();
    expect(result.title).toBe(regsiterWorkoutData.title)
    expect(result.duration).toBe(20)
    
})
it("Should return workout given id", async ()=>{
    const userId = "64f9a1e2b3c4d5e6f7a8b9c0";
    const workoutId  = "54f9a1e2b3c4d5e6f7f8b9a0";
    const mockWorkOut = {
        _id: new mongoose.Types.ObjectId(workoutId),
        userId: new mongoose.Types.ObjectId(userId),
        title: "Mock workout",
      description: "A simple mock workout",
      workoutType: "strength" as "strength",
      exercises: [
        { name: "mock exercise", sets: 5, reps: 8 },
        { name: "mock exercise 2", sets: 7, reps: 7 }
      ],
      duration: 20,
      caloriesBurned: 0,
      workoutDate: new Date(),
      difficulty: 5,
      tags: ["1", "2"],
      status: "scheduled"
    };

    const workoutFromDb = {
        ...mockWorkOut,
        createdAt: new Date(),
        updatedAt: new Date()
    };
   (WorkoutModel.findOne as jest.Mock).mockResolvedValue(workoutFromDb);
     const result = await service.getWorkoutById(workoutId, userId)
     expect(result.description).toBe(mockWorkOut.description)
})


})
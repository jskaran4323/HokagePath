import authService, { AuthService } from "../../src/v1/services/authService";

import UserModel from "../../src/models/User";
import FitnessProfileModel from "../../src/models/FitnessProfile";
import WorkoutStatsModel from "../../src/models/WorkoutStats";

import bcrypt from "bcryptjs";
jest.mock("bcryptjs");
jest.mock("../../src/models/User");
jest.mock("../../src/models/FitnessProfile");
jest.mock("../../src/models/WorkoutStats");

const registerData = {
    username: "testuser",
    email: "test@test.com",
    password: "123456",
    fullName: "Test User",
  };
  describe("AuthService - register (happy path)", () => {
    const service = new AuthService();
  
    afterEach(() => {
      jest.clearAllMocks();

    });
  
    it("should create user and related records", async () => {
      
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
  
      const mockUser = {
        _id: "user123",
        email: registerData.email,
        username: registerData.username,
      };
  
      // mock creations
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
      (FitnessProfileModel.create as jest.Mock).mockResolvedValue({});
      (WorkoutStatsModel.create as jest.Mock).mockResolvedValue({});
  
      const result = await service.register(registerData);
  
      // user created
      expect(UserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerData.email,
          username: registerData.username,
        })
      );
  
      // related records created
      expect(FitnessProfileModel.create).toHaveBeenCalled();
      expect(WorkoutStatsModel.create).toHaveBeenCalled();
  
      // response returned
      expect(result.email).toBe(registerData.email);
    });


    it("should return user after login", async()=>{
     
       
      const mockUser = {
        _id: "user123",
        email: registerData.email,
        username: registerData.username,
        password: registerData.password
      };
      const loginInfo = {
       email: registerData.email,
       password: registerData.password
      };
       
      (UserModel.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const result = await service.login(loginInfo);
      expect(result.email).toBe(registerData.email);
      

    })


    it("should return userProfile", async ()=>{
      const mockUser = {
        _id: "user123",
        email: "a@b.com",
        username: "test",
        fullName: "Test User",
      };
      const mockFitnessProfile = {
        userId: "user123",
        currentWeight: 70,
        height: 175,
        age: 25,
        gender: "male",
        fitnessGoal: "gain muscle",
      };
      const mockWorkoutStats = {
        userId: "user123",
        workoutsCompleted: 10,
      };
      (UserModel.findById as jest.Mock).mockReturnValue(mockUser);
      (FitnessProfileModel.findOne as jest.Mock).mockReturnValue(mockFitnessProfile);

      (WorkoutStatsModel.findOne as jest.Mock).mockReturnValue(mockWorkoutStats);
        

      const result = await authService.getUserProfile("user123")
      expect(UserModel.findById).toHaveBeenCalledWith("user123");
      expect(FitnessProfileModel.findOne).toHaveBeenCalledWith({ userId: "user123" });
      expect(WorkoutStatsModel.findOne).toHaveBeenCalledWith({ userId: "user123" });
    
      expect(result.user.email).toBe(mockUser.email);
      expect(result.fitnessProfile).toBe(mockFitnessProfile);
      expect(result.workoutStats).toBe(mockWorkoutStats);
    })
  });


    
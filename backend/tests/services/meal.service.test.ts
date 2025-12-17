import mongoose from "mongoose";
import MealModel from "../../src/models/Meal";
import { CreateMealDTO } from "../../src/types/meal.dto";
import { MealService } from "../../src/v1/services/mealService";

jest.mock("../../src/models/Meal"); // Mock Mongoose model

describe("MealService test", () => {
  const service = new MealService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should create a meal plan", async () => {
    const userId = "user1234";

  
    const createMealDto: CreateMealDTO = {
      title: "Mock Meal",
      description: "A simple mock meal",
      mealType: "breakfast",
      foods: [
        {
            name: "Eggs", quantity: 2,
            unit: "gms"
        },
        {
            name: "Toast", quantity: 1,
            unit: "gms"
        }
      ],
      totalMacros: {
          protein: 20, carbs: 30, fats: 10,
          calories: 0
      },
      mealDate: new Date(),
      imageUrl: "http://example.com/image.jpg",
      dietaryTags: ["high-protein"],
      preparationTime: 15,
      recipe: "Cook eggs and toast together",
     
     
     
    };

    const mockMealFromDB = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      ...createMealDto,
      createdAt: new Date(),
      updatedAt: new Date()
    };

   
    (MealModel.create as jest.Mock).mockResolvedValue(mockMealFromDB);

    const result = await service.createMeal(userId, createMealDto);

    expect(MealModel.create).toHaveBeenCalledWith({
      userId,
      ...createMealDto
    });
    expect(result.title).toBe(createMealDto.title);
    expect(result.userId).toBe(userId);
    expect(result.id).toBeDefined();
    expect(result.foods.length).toBe(2);
    expect(result.totalMacros.protein).toBe(20);
  });

  it("should return a meal by ID", async () => {
    const userId = "user123";
    const mealId = new mongoose.Types.ObjectId();

    const mockMealFromDb = {
      _id: mealId,
      userId,
      title: "Mock Meal",
      description: "A simple mock meal",
      mealType: "breakfast" as "breakfast",
      foods: [
        { name: "Eggs", quantity: "2" },
        { name: "Toast", quantity: "1 slice" }
      ],
      totalMacros: { protein: 20, carbs: 30, fat: 10 },
      isAIGenerated: false,
      mealDate: new Date(),
      dietaryTags: ["high-protein"],
      preparationTime: 15,
      recipe: "Cook eggs and toast together",
      userRating: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

  
    (MealModel.findOne as jest.Mock).mockResolvedValue(mockMealFromDb);

    const result = await service.getMealById(mealId.toString(), userId);

    expect(MealModel.findOne).toHaveBeenCalledWith({ _id: mealId.toString(), userId });
    expect(result.id).toBe(mealId.toString());
    expect(result.userId).toBe(userId);
    expect(result.title).toBe("Mock Meal");
    
  });
});

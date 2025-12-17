import userService from "../../src/v1/services/userService";


jest.mock("../../src/v1/services/userService");

jest.mock("../../src/middleware/upload", () => ({
    uploadProfilePicture: jest.fn((req: any, res: any, next: any) => {
        next();
    }),
}));


import { uploadProfilePicture } from "../../src/middleware/upload";
import { uploadPostImages } from "../../src/v1/controllers/uploadController";

describe("upload picture test to cloud", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should upload profile picture and update user", async () => {
        const req: any = {
            user: { id: "user123" },
            file: {
                location: "https://s3.aws.com/profile.jpg",
            }
        };
         
        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        const next = jest.fn();

        const updatedUser = {
            id: "user123",
            profilePicture: "https://s3.aws.com/profile.jpg",
        };

        (userService.updateProfile as jest.Mock).mockResolvedValue(updatedUser);
        
        
        (uploadProfilePicture as jest.Mock).mockImplementation((req, res, next) => {
            next();
        });
        
        await uploadProfilePicture(req, res, next);
        
        expect(uploadProfilePicture).toHaveBeenCalledWith(req, res, next);
    });

    it("should upload multiple images successfully", async () => {
        const req: any = {
            files: [
                { location: "https://s3.aws.com/image1.jpg" },
                { location: "https://s3.aws.com/image2.jpg" },
                { location: "https://s3.aws.com/image3.jpg" }
            ]
        };

        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        await uploadPostImages(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Images uploaded successfully',
            data: {
                imageUrls: [
                    "https://s3.aws.com/image1.jpg",
                    "https://s3.aws.com/image2.jpg",
                    "https://s3.aws.com/image3.jpg"
                ]
            }
        });
    });
});
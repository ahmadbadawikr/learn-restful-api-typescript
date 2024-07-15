import { NextFunction, Request, Response } from "express"; // Import necessary types from Express
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from "../model/user-model"; // Import the CreateUserRequest type
import { UserService } from "../services/user-service"; // Import the UserService class
import { UserRequest } from "../type/user-request";

/**
 * UserController class to handle incoming HTTP requests related to user operations.
 */
export class UserController {

    /**
     * Handles the user registration request. It extracts the request body, calls the UserService
     * to register the user, and sends the appropriate response.
     * 
     * @param {Request} req - The Express request object containing the HTTP request.
     * @param {Response} res - The Express response object to send the HTTP response.
     * @param {NextFunction} next - The Express next function to pass control to the next middleware.
     */
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            // Extract the CreateUserRequest data from the request body
            const request: CreateUserRequest = req.body as CreateUserRequest;
            
            // Call the UserService to register the user and get the response
            const response = await UserService.register(request);
            
            // Send the response with status 200 and the registered user data
            res.status(200).json({
                data: response
            });
        } catch (e) {
            // Pass any errors to the next middleware for error handling
            next(e);
        }
    }
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            
            const response = await UserService.login(request);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            // Pass any errors to the next middleware for error handling
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            
            const response = await UserService.get(req.user!);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            // Pass any errors to the next middleware for error handling
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRequest = req.body as UpdateUserRequest
            const response = await UserService.update(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            // Pass any errors to the next middleware for error handling
            next(e);
        }
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.logout(req.user!);
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            // Pass any errors to the next middleware for error handling
            next(e);
        }
    }
}
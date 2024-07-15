// Import necessary modules and dependencies
import { User } from "@prisma/client";
import { prismaClient } from "../application/database"; // Import Prisma client for database operations
import { ResponseError } from "../error/response-error"; // Import custom error class for handling response errors
import { CreateUserRequest, LoginUserRequest, toUserResponse, UserResponse } from "../model/user-model"; // Import user model types and conversion functions
import { UserValidation } from "../validation/user-validation"; // Import user validation schema
import { Validation } from "../validation/validation"; // Import general validation utility
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { v4 as uuid } from "uuid";
/**
 * UserService class to handle user-related operations such as registration.
 */
export class UserService {
    /**
     * Registers a new user by validating the request, checking for existing usernames,
     * hashing the password, and saving the user to the database.
     * 
     * @param {CreateUserRequest} request - The request object containing user registration details.
     * @returns {Promise<UserResponse>} - A promise that resolves to the created user's response object.
     * @throws {ResponseError} - Throws an error if the username already exists.
     */
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        // Validate the incoming registration request using the defined schema
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);
        
        // Check if a user with the same username already exists in the database
        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: registerRequest.username
            }
        });

        // If a user with the same username exists, throw an error
        if (totalUserWithSameUsername != 0) {
            throw new ResponseError(400, "Username already exists");
        }

        // Hash the user's password using bcrypt
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        // Create the new user in the database with the validated and hashed data
        const user = await prismaClient.user.create({
            data: registerRequest
        });

        // Convert the created user entity to a user response object and return it
        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        });

        if(!user) {
            throw new ResponseError(401, "Username or Password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if(!isPasswordValid) {
            throw new ResponseError(401, "Username or Password is wrong");
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        });

        const response = toUserResponse(user);
        response.token = user.token!;
        return response

    }
}
import { User } from "@prisma/client"; // Import the User type from Prisma client

// Define the UserResponse type, which is used to represent the user data returned by the API
export type UserResponse = {
    username: string; // The username of the user
    name: string;     // The name of the user
    token?: string;   // Optional token for authentication
}

// Define the CreateUserRequest type, which is used to represent the data required to create a new user
export type CreateUserRequest = {
    username: string; // The username of the new user
    name: string;     // The name of the new user
    password: string; // The password of the new user
}

export type LoginUserRequest = {
    username: string; // The username of the new user
    password: string; // The password of the new user
}

/**
 * Converts a User object from the database to a UserResponse object.
 * 
 * @param {User} user - The user object retrieved from the database.
 * @returns {UserResponse} - The user response object to be returned by the API.
 */
export function toUserResponse(user: User): UserResponse {
    return {
        name: user.name,        // Map the name property from the User object
        username: user.username // Map the username property from the User object
    }
}


import { api } from "../../api/apiFinancial";
import type {  CreateUserDto, UpdateUserDto, UserResponse } from './userInterfaces';

export const userService = {
     getUsers: async() : Promise<UserResponse[]> =>{
        const response = await api.get('/user');
        return response.data.data;
     },
    getUserById: async(id: number) : Promise<UserResponse> =>{
        const response = await api.get(`/user/${id}`);
        return response.data.data;
    },
    createUser: async(userData: CreateUserDto) =>{
        const response = await api.post('/user', userData);
        return response.data;
    },
    deleteUser: async(userId: number) : Promise<UserResponse> =>{
        const response = await api.delete(`/user/${userId}`);
        return response.data;
    },
    updateUser: async(userId: number, userData: UpdateUserDto) =>{
        const response = await api.put(`/user/${userId}`, userData);
        return response.data;
    }

}
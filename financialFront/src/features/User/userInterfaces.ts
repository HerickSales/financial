import type { TransactionResponse } from "../Transaction/transactionInterfaces";

export type CreateUserDto = {
    name: string;
    age: number;
}
export type UpdateUserDto = {
    name: string;
    age: number;
}
export type UserResponse = {
    id: number;
    name: string;
    age: number;
    transactions: TransactionResponse[];
}


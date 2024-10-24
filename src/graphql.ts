
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateAuthInput {
    exampleField: number;
}

export interface CreateTransactionInput {
    exampleField: number;
}

export interface CreateUserInput {
    exampleField: number;
}

export interface UpdateAuthInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface UpdateTransactionInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface UpdateUserInput {
    exampleField?: Nullable<number>;
    id: number;
}

export interface Auth {
    exampleField: number;
}

export interface IMutation {
    createAuth(createAuthInput: CreateAuthInput): Auth | Promise<Auth>;
    createTransaction(createTransactionInput: CreateTransactionInput): Transaction | Promise<Transaction>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    removeAuth(id: number): Auth | Promise<Auth>;
    removeTransaction(id: number): Transaction | Promise<Transaction>;
    removeUser(id: number): User | Promise<User>;
    updateAuth(updateAuthInput: UpdateAuthInput): Auth | Promise<Auth>;
    updateTransaction(updateTransactionInput: UpdateTransactionInput): Transaction | Promise<Transaction>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
    auth(id: number): Auth | Promise<Auth>;
    transaction(id: number): Transaction | Promise<Transaction>;
    user(id: number): User | Promise<User>;
}

export interface Transaction {
    exampleField: number;
}

export interface User {
    exampleField: number;
}

type Nullable<T> = T | null;

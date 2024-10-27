
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    ADMIN = "ADMIN",
    MASTER = "MASTER",
    SUPERADMIN = "SUPERADMIN",
    SYSTEM = "SYSTEM",
    USER = "USER"
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum TransactionType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface SignInCredential {
    password: string;
    username: string;
}

export interface SignUpCredential {
    email: string;
    password: string;
    role: Role;
    username: string;
}

export interface IMutation {
    refreshAccessToken(refreshToken: string, token: string): Token | Promise<Token>;
    signUp(signUpCredential: SignUpCredential): User | Promise<User>;
}

export interface IQuery {
    signIn(signInCredential: SignInCredential): UserToken | Promise<UserToken>;
}

export interface Token {
    access_token: string;
    refresh_token: string;
}

export interface Transaction {
    admin: User;
    amount: number;
    createdAt: DateTime;
    deletedAt: DateTime;
    id: string;
    status: Status;
    transactionDate: DateTime;
    type: TransactionType;
    updatedAt: DateTime;
    user: User;
}

export interface User {
    adminTransactions: Transaction;
    createdAt: DateTime;
    deletedAt: DateTime;
    email: string;
    id: string;
    name: string;
    password: string;
    profile: string;
    role: Role;
    status: UserStatus;
    transactions: Transaction;
    updatedAt: DateTime;
    username: string;
    wallet: number;
}

export interface UserToken {
    access_token: string;
    refresh_token: string;
    user: User;
}

export type DateTime = any;
type Nullable<T> = T | null;

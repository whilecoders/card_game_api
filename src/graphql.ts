
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum GameKqjCards {
    JACK_OF_CLUBS = "JACK_OF_CLUBS",
    JACK_OF_DIAMONDS = "JACK_OF_DIAMONDS",
    JACK_OF_HEARTS = "JACK_OF_HEARTS",
    JACK_OF_SPADES = "JACK_OF_SPADES",
    KING_OF_CLUBS = "KING_OF_CLUBS",
    KING_OF_DIAMONDS = "KING_OF_DIAMONDS",
    KING_OF_HEARTS = "KING_OF_HEARTS",
    KING_OF_SPADES = "KING_OF_SPADES",
    QUEEN_OF_CLUBS = "QUEEN_OF_CLUBS",
    QUEEN_OF_DIAMONDS = "QUEEN_OF_DIAMONDS",
    QUEEN_OF_HEARTS = "QUEEN_OF_HEARTS",
    QUEEN_OF_SPADES = "QUEEN_OF_SPADES"
}

export enum GameStatus {
    AVAILABLE = "AVAILABLE",
    FINISHED = "FINISHED",
    UNAVAILABLE = "UNAVAILABLE",
    UPCOMING = "UPCOMING"
}

export enum GameType {
    KQJ = "KQJ"
}

export enum RecordSessionStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    INACTIVE = "INACTIVE"
}

export enum Role {
    ADMIN = "ADMIN",
    MASTER = "MASTER",
    SUPERADMIN = "SUPERADMIN",
    SYSTEM = "SYSTEM",
    USER = "USER"
}

export enum TokenValues {
    TOKEN_11 = "TOKEN_11",
    TOKEN_55 = "TOKEN_55",
    TOKEN_110 = "TOKEN_110",
    TOKEN_550 = "TOKEN_550",
    TOKEN_1100 = "TOKEN_1100",
    TOKEN_5500 = "TOKEN_5500"
}

export enum TransactionType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED"
}

export interface AddUserDto {
    city: string;
    email: string;
    password: string;
    phone_number: number;
    username: string;
}

export interface CreateGamesDto {
    admin_id: number;
    end_date: DateTime;
    end_time: string;
    game_duration: number;
    game_in_day: number;
    game_status: GameStatus;
    game_type: GameType;
    start_date: DateTime;
    start_time: string;
}

export interface CreateRecordSessionKqjDto {
    choosen_card: GameKqjCards;
    gameSessionId: number;
    record_status: RecordSessionStatus;
    token: TokenValues;
    userId: number;
}

export interface CreateTransactionSessionDto {
    recordSessionId: number;
    token: TokenValues;
    type: TransactionType;
}

export interface ResetPasswordDto {
    confirmPassword: string;
    currentPassword: string;
    email: string;
    newPassword: string;
}

export interface SignInCredential {
    password: string;
    username: string;
}

export interface SignUpCredential {
    city: string;
    email: string;
    password: string;
    phone_number: number;
    role: Role;
    username: string;
}

export interface SuspendUserDto {
    suspend: boolean;
    userId: number;
}

export interface UpdateGameSessionDto {
    game_result_card: GameKqjCards;
}

export interface UpdateGamesDto {
    end_date: DateTime;
    end_time: string;
    game_duration: number;
    game_in_day: number;
    game_status: GameStatus;
    start_date: DateTime;
    start_time: string;
}

export interface UpdateUserDto {
    city?: Nullable<string>;
    name?: Nullable<string>;
    phone_number?: Nullable<number>;
    role?: Nullable<Role>;
}

export interface WalletDto {
    token: TokenValues;
    type: TransactionType;
}

export interface DailyGame {
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    games: Games;
    id: number;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface GameSession {
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    game: Games;
    game_result_card?: Nullable<GameKqjCards>;
    id: number;
    record_session_kqj?: Nullable<RecordSessionKqj>;
    session_end_time?: Nullable<DateTime>;
    session_start_time?: Nullable<DateTime>;
    session_status: GameKqjCards;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface Games {
    DailyGame?: Nullable<DailyGame[]>;
    admin: User;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    end_date: DateTime;
    end_time: string;
    gameSession?: Nullable<GameSession[]>;
    game_duration: number;
    game_in_day: number;
    game_status: GameStatus;
    game_type: GameType;
    id: number;
    start_date: DateTime;
    start_time: string;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface IMutation {
    DeleteGames(id: number): boolean | Promise<boolean>;
    addUser(addUserDto: AddUserDto): User | Promise<User>;
    createGameSession(): Games[] | Promise<Games[]>;
    createGames(createGamesDto: CreateGamesDto): Games | Promise<Games>;
    createRecordSession(createRecordSessionKqjDto: CreateRecordSessionKqjDto): RecordSessionKqj | Promise<RecordSessionKqj>;
    createTransactionSession(createTransactionSessionDto: CreateTransactionSessionDto): TransactionSession | Promise<TransactionSession>;
    refreshAccessToken(refreshToken: string, token: string): Token | Promise<Token>;
    resetPassword(resetPasswordDto: ResetPasswordDto): string | Promise<string>;
    signUp(signUpCredential: SignUpCredential): User | Promise<User>;
    suspendUser(suspendUserDto: SuspendUserDto): User | Promise<User>;
    updateGameSession(id: number, updateGameSessionDto: UpdateGameSessionDto): GameSession | Promise<GameSession>;
    updateGames(id: number, updateGamesDto: UpdateGamesDto): Games | Promise<Games>;
    updateUser(id: number, updateUserDto: UpdateUserDto): User | Promise<User>;
    updateWallet(adminId: number, userId: number, walletData: WalletDto): Transaction | Promise<Transaction>;
}

export interface IQuery {
    getAllGameSessions(): GameSession[] | Promise<GameSession[]>;
    getAllGameses(): Games[] | Promise<Games[]>;
    getAllRecordSessions(): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getAllRecordsBy(SessionId: number): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getAllTransactionSessions(): TransactionSession[] | Promise<TransactionSession[]>;
    getAllUsers(): User[] | Promise<User[]>;
    getGameSessionBy(id: number): GameSession | Promise<GameSession>;
    getGameSessionsByDate(endDate: DateTime, startDate: DateTime): GameSession[] | Promise<GameSession[]>;
    getGamesBy(id: number): Games | Promise<Games>;
    getGamesByDate(from: DateTime, to: DateTime): Games[] | Promise<Games[]>;
    getLiveGameSessions(): GameSession[] | Promise<GameSession[]>;
    getRecordBy(SessionId: number): RecordSessionKqj | Promise<RecordSessionKqj>;
    getRecordSessionBy(id: number): RecordSessionKqj | Promise<RecordSessionKqj>;
    getRecordsBy(UserId: number): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getTodaysGameSession(): GameSession[] | Promise<GameSession[]>;
    getTransactionSessionBy(id: number): TransactionSession | Promise<TransactionSession>;
    getUserById(id: number): User | Promise<User>;
    getUserByRole(role: number): User[] | Promise<User[]>;
    getUsersByCreatedAt(date: DateTime): User[] | Promise<User[]>;
    signIn(signInCredential: SignInCredential): UserToken | Promise<UserToken>;
}

export interface RecordSessionKqj {
    choosen_card: GameKqjCards;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    game_session_id: GameSession;
    id: number;
    record_status: RecordSessionStatus;
    token: TokenValues;
    transaction_session_id?: Nullable<TransactionSession>;
    updatedAt: DateTime;
    updatedBy: string;
    user: User;
}

export interface Token {
    access_token: string;
    refresh_token: string;
}

export interface Transaction {
    admin: User;
    amount: number;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    id: number;
    transactionDate: DateTime;
    type: TransactionType;
    updatedAt: DateTime;
    updatedBy: string;
    user: User;
}

export interface TransactionSession {
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    id: number;
    record_session_kqj: RecordSessionKqj;
    token: TokenValues;
    type: TransactionType;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface User {
    city: string;
    createdAt: DateTime;
    createdBy: string;
    createdGames: Games;
    deletedAt: DateTime;
    deletedBy: string;
    email: string;
    id: number;
    name?: Nullable<string>;
    password: string;
    phone_number: number;
    profile?: Nullable<string>;
    record_session_kqj: RecordSessionKqj;
    role: Role;
    status: UserStatus;
    updatedAt: DateTime;
    updatedBy: string;
    userTransactions: Transaction;
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

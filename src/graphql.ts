
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

export enum GameSessionStatus {
    END = "END",
    INACTIVE = "INACTIVE",
    LIVE = "LIVE",
    UPCOMING = "UPCOMING"
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

export enum MessageType {
    AUDIO = "AUDIO",
    IMAGE = "IMAGE",
    INFO = "INFO",
    MESSAGE = "MESSAGE",
    TRADE = "TRADE",
    VIDEO = "VIDEO"
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

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
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

export interface CreateGamesDto {
    end_time: DateTime;
    game_duration: number;
    game_in_day: number;
    game_status: GameStatus;
    game_type: GameType;
    start_time: DateTime;
    user_id: number;
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
    type?: Nullable<TransactionType>;
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

export interface UpdateGameSessionDto {
    game_result_card?: Nullable<GameKqjCards>;
    session_end_time?: Nullable<string>;
    session_start_time?: Nullable<string>;
    session_status?: Nullable<GameSessionStatus>;
}

export interface UpdateGamesDto {
    end_time: DateTime;
    game_duration: number;
    game_in_day: number;
    game_status: GameStatus;
    start_time: DateTime;
}

export interface WalletDto {
    amount: number;
    type: TransactionType;
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
    admin: User;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    end_time: DateTime;
    gameSession?: Nullable<GameSession[]>;
    game_duration: number;
    game_in_day: number;
    game_status: GameStatus;
    game_type: GameType;
    id: number;
    start_time: DateTime;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface Message {
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    exampleField: number;
    id: number;
    imageUrl: string;
    message: string;
    messageStatus: MessageType;
    messageType: MessageType;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface IMutation {
    DeleteGames(id: number): boolean | Promise<boolean>;
    createGames(createGamesDto: CreateGamesDto): Games | Promise<Games>;
    createRecordSession(createRecordSessionKqjDto: CreateRecordSessionKqjDto): RecordSessionKqj | Promise<RecordSessionKqj>;
    createTransactionSession(createTransactionSessionDto: CreateTransactionSessionDto): TransactionSession | Promise<TransactionSession>;
    refreshAccessToken(refreshToken: string, token: string): Token | Promise<Token>;
    signUp(signUpCredential: SignUpCredential): User | Promise<User>;
    updateGameSession(id: number, updateGameSessionDto: UpdateGameSessionDto): GameSession | Promise<GameSession>;
    updateGames(id: number, updateGamesDto: UpdateGamesDto): Games | Promise<Games>;
    updateWallet(adminId: number, userId: number, walletData: WalletDto): Transaction | Promise<Transaction>;
}

export interface IQuery {
    getAllGameSessions(): GameSession[] | Promise<GameSession[]>;
    getAllGameses(): Games[] | Promise<Games[]>;
    getAllRecordSessions(): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getAllTransactionSessions(): TransactionSession[] | Promise<TransactionSession[]>;
    getGameSessionById(id: number): GameSession | Promise<GameSession>;
    getGameSessionsByDate(endDate: DateTime, startDate: DateTime): GameSession[] | Promise<GameSession[]>;
    getGamesByDate(endDate: string, startDate: string): Games[] | Promise<Games[]>;
    getGamesById(id: number): Games | Promise<Games>;
    getLiveGameSessions(): GameSession[] | Promise<GameSession[]>;
    getRecordBySessionId(sessionId: string): RecordSessionKqj | Promise<RecordSessionKqj>;
    getRecordSessionById(id: number): RecordSessionKqj | Promise<RecordSessionKqj>;
    getRecordsByUserId(userId: string): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getTransactionSessionById(id: number): TransactionSession | Promise<TransactionSession>;
    signIn(signInCredential: SignInCredential): UserToken | Promise<UserToken>;
}

export interface RecordSessionKqj {
    choosen_card: GameKqjCards;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    game_session: GameSession;
    id: number;
    record_status: RecordSessionStatus;
    token: TokenValues;
    transaction_session?: Nullable<TransactionSession>;
    updatedAt: DateTime;
    updatedBy: string;
    user: User;
}

export interface Room {
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    id: number;
    latestMessage: Message;
    members: User[];
    messages?: Nullable<Message[]>;
    status: Status;
    updatedAt: DateTime;
    updatedBy: string;
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
    createdAt: DateTime;
    createdBy: string;
    createdGames: Games;
    deletedAt: DateTime;
    deletedBy: string;
    email: string;
    id: number;
    name?: Nullable<string>;
    password: string;
    profile?: Nullable<string>;
    record_session_kqj: RecordSessionKqj;
    role: Role;
    room: Room;
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

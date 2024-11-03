
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Game {
    KQJ = "KQJ"
}

export enum GameKqjCards {
    ACE_OF_CLUBS = "ACE_OF_CLUBS",
    ACE_OF_DIAMONDS = "ACE_OF_DIAMONDS",
    ACE_OF_HEARTS = "ACE_OF_HEARTS",
    ACE_OF_SPADES = "ACE_OF_SPADES",
    EIGHT_OF_CLUBS = "EIGHT_OF_CLUBS",
    EIGHT_OF_DIAMONDS = "EIGHT_OF_DIAMONDS",
    EIGHT_OF_HEARTS = "EIGHT_OF_HEARTS",
    EIGHT_OF_SPADES = "EIGHT_OF_SPADES",
    FIVE_OF_CLUBS = "FIVE_OF_CLUBS",
    FIVE_OF_DIAMONDS = "FIVE_OF_DIAMONDS",
    FIVE_OF_HEARTS = "FIVE_OF_HEARTS",
    FIVE_OF_SPADES = "FIVE_OF_SPADES",
    FOUR_OF_CLUBS = "FOUR_OF_CLUBS",
    FOUR_OF_DIAMONDS = "FOUR_OF_DIAMONDS",
    FOUR_OF_HEARTS = "FOUR_OF_HEARTS",
    FOUR_OF_SPADES = "FOUR_OF_SPADES",
    JACK_OF_CLUBS = "JACK_OF_CLUBS",
    JACK_OF_DIAMONDS = "JACK_OF_DIAMONDS",
    JACK_OF_HEARTS = "JACK_OF_HEARTS",
    JACK_OF_SPADES = "JACK_OF_SPADES",
    KING_OF_CLUBS = "KING_OF_CLUBS",
    KING_OF_DIAMONDS = "KING_OF_DIAMONDS",
    KING_OF_HEARTS = "KING_OF_HEARTS",
    KING_OF_SPADES = "KING_OF_SPADES",
    NINE_OF_CLUBS = "NINE_OF_CLUBS",
    NINE_OF_DIAMONDS = "NINE_OF_DIAMONDS",
    NINE_OF_HEARTS = "NINE_OF_HEARTS",
    NINE_OF_SPADES = "NINE_OF_SPADES",
    QUEEN_OF_CLUBS = "QUEEN_OF_CLUBS",
    QUEEN_OF_DIAMONDS = "QUEEN_OF_DIAMONDS",
    QUEEN_OF_HEARTS = "QUEEN_OF_HEARTS",
    QUEEN_OF_SPADES = "QUEEN_OF_SPADES",
    SEVEN_OF_CLUBS = "SEVEN_OF_CLUBS",
    SEVEN_OF_DIAMONDS = "SEVEN_OF_DIAMONDS",
    SEVEN_OF_HEARTS = "SEVEN_OF_HEARTS",
    SEVEN_OF_SPADES = "SEVEN_OF_SPADES",
    SIX_OF_CLUBS = "SIX_OF_CLUBS",
    SIX_OF_DIAMONDS = "SIX_OF_DIAMONDS",
    SIX_OF_HEARTS = "SIX_OF_HEARTS",
    SIX_OF_SPADES = "SIX_OF_SPADES",
    TEN_OF_CLUBS = "TEN_OF_CLUBS",
    TEN_OF_DIAMONDS = "TEN_OF_DIAMONDS",
    TEN_OF_HEARTS = "TEN_OF_HEARTS",
    TEN_OF_SPADES = "TEN_OF_SPADES",
    THREE_OF_CLUBS = "THREE_OF_CLUBS",
    THREE_OF_DIAMONDS = "THREE_OF_DIAMONDS",
    THREE_OF_HEARTS = "THREE_OF_HEARTS",
    THREE_OF_SPADES = "THREE_OF_SPADES",
    TWO_OF_CLUBS = "TWO_OF_CLUBS",
    TWO_OF_DIAMONDS = "TWO_OF_DIAMONDS",
    TWO_OF_HEARTS = "TWO_OF_HEARTS",
    TWO_OF_SPADES = "TWO_OF_SPADES"
}

export enum GameLaunchStatus {
    AVAILABLE = "AVAILABLE",
    FINISHED = "FINISHED",
    UNAVAILABLE = "UNAVAILABLE",
    UPCOMING = "UPCOMING"
}

export enum GameSessionStatus {
    END = "END",
    INACTIVE = "INACTIVE",
    LIVE = "LIVE",
    UPCOMING = "UPCOMING"
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

export interface CreateGameLaunchDto {
    end_time: string;
    game: Game;
    game_duration: string;
    game_in_day: number;
    game_launch_status: GameLaunchStatus;
    start_time: string;
}

export interface CreateRecordSessionKqjDto {
    choosen_card: GameKqjCards;
    gameSessionId: string;
    record_status: RecordSessionStatus;
    token: TokenValues;
    userId: string;
}

export interface CreateTransactionSessionDto {
    recordSessionId: string;
    token: TokenValues;
    type: TransactionType;
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

export interface UpdateGameLaunchDto {
    end_time: string;
    game_duration: string;
    game_in_day: number;
    game_launch_status: GameLaunchStatus;
    start_time: string;
}

export interface UpdateGameSessionDto {
    game_result_card: GameKqjCards;
    session_status?: Nullable<GameSessionStatus>;
}

export interface UpdateTransactionSessionDto {
    id: string;
    recordSessionId?: Nullable<string>;
    token?: Nullable<TokenValues>;
    type?: Nullable<TransactionType>;
}

export interface WalletDto {
    token: TokenValues;
    type: TransactionType;
}

export interface GameLaunch {
    admin: User;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    end_time: DateTime;
    game: Game;
    gameSession?: Nullable<GameSession[]>;
    game_duration: string;
    game_in_day: number;
    game_launch_status: GameLaunchStatus;
    id: string;
    start_time: DateTime;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface GameSession {
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    game_launch: GameLaunch;
    game_result_card: GameKqjCards;
    id: string;
    record_session_kqj: RecordSessionKqj;
    session_end_time: DateTime;
    session_start_time: DateTime;
    session_status: GameKqjCards;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface IMutation {
    DeleteGameLaunch(id: string): boolean | Promise<boolean>;
    createGameLaunch(adminId: string, createGameLaunchDto: CreateGameLaunchDto): GameLaunch | Promise<GameLaunch>;
    createRecordSession(createRecordSessionKqjDto: CreateRecordSessionKqjDto): RecordSessionKqj | Promise<RecordSessionKqj>;
    createTransactionSession(createTransactionSessionDto: CreateTransactionSessionDto): TransactionSession | Promise<TransactionSession>;
    refreshAccessToken(refreshToken: string, token: string): Token | Promise<Token>;
    signUp(signUpCredential: SignUpCredential): User | Promise<User>;
    undeleteGameLaunch(id: string): boolean | Promise<boolean>;
    updateGameLaunch(id: string, updateGameLaunchDto: UpdateGameLaunchDto): GameLaunch | Promise<GameLaunch>;
    updateGameSession(id: string, updateGameSessionDto: UpdateGameSessionDto): GameSession | Promise<GameSession>;
    updateTransactionSession(id: string, updateTransactionSessionDto: UpdateTransactionSessionDto): TransactionSession | Promise<TransactionSession>;
    updateWallet(adminId: string, userId: string, walletData: WalletDto): Transaction | Promise<Transaction>;
}

export interface IQuery {
    getAllGameLaunches(): GameLaunch[] | Promise<GameLaunch[]>;
    getAllGameSessions(): GameSession[] | Promise<GameSession[]>;
    getAllRecordSessions(): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getAllRecordsBySessionId(sessionId: string): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getAllTransactionSessions(): TransactionSession[] | Promise<TransactionSession[]>;
    getGameLaunchByDate(endDate: string, startDate: string): GameLaunch[] | Promise<GameLaunch[]>;
    getGameLaunchById(id: string): GameLaunch | Promise<GameLaunch>;
    getGameSessionById(id: string): GameSession | Promise<GameSession>;
    getGameSessionsByDate(date: string): GameSession[] | Promise<GameSession[]>;
    getLiveGameSessions(): GameSession[] | Promise<GameSession[]>;
    getRecordBySessionId(sessionId: string): RecordSessionKqj | Promise<RecordSessionKqj>;
    getRecordSessionById(id: string): RecordSessionKqj | Promise<RecordSessionKqj>;
    getRecordsByUserId(userId: string): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getTransactionSessionById(id: string): TransactionSession | Promise<TransactionSession>;
    signIn(signInCredential: SignInCredential): UserToken | Promise<UserToken>;
}

export interface RecordSessionKqj {
    choosen_card: GameKqjCards;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    game_session: GameSession;
    id: string;
    record_status: RecordSessionStatus;
    token: TokenValues;
    transaction_session: TransactionSession;
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
    id: string;
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
    id: string;
    record_session_kqj: RecordSessionKqj;
    token: TokenValues;
    type: TransactionType;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface User {
    createGames: GameLaunch;
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    email: string;
    id: string;
    name?: Nullable<string>;
    password: string;
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

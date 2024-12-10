
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
    SUSPENDED = "SUSPENDED"
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
    phone_number: string;
    role: Role;
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

export interface DateFilterDto {
    endDate?: Nullable<DateTime>;
    startDate?: Nullable<DateTime>;
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
    phone_number: string;
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
    admin_id: number;
    end_date: DateTime;
    end_time: string;
    game_duration?: Nullable<number>;
    game_id: number;
    game_in_day?: Nullable<number>;
    game_status?: Nullable<GameStatus>;
    game_type?: Nullable<GameType>;
    start_date: DateTime;
    start_time: string;
}

export interface UpdateUserDto {
    address?: Nullable<string>;
    city?: Nullable<string>;
    email?: Nullable<string>;
    name?: Nullable<string>;
    phone_number?: Nullable<string>;
    role?: Nullable<Role>;
    status?: Nullable<UserStatus>;
    username?: Nullable<string>;
}

export interface UserFiltersInput {
    city?: Nullable<string>;
    email?: Nullable<string>;
    id?: Nullable<number>;
    name?: Nullable<string>;
    phone_number?: Nullable<string>;
    role?: Nullable<Role>;
    status?: Nullable<UserStatus>;
    username?: Nullable<string>;
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

export interface DailyWinnersAndLosers {
    losers: number;
    winners: number;
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

export interface Message {
    createdAt: DateTime;
    createdBy: string;
    deletedAt: DateTime;
    deletedBy: string;
    exampleField: number;
    id: number;
    imageUrl: string;
    message: string;
    messageType: MessageType;
    updatedAt: DateTime;
    updatedBy: string;
}

export interface IMutation {
    DeleteGames(id: number): boolean | Promise<boolean>;
    addUser(addUserDto: AddUserDto): User | Promise<User>;
    adminSignUp(signUpCredential: SignUpCredential): User | Promise<User>;
    createGames(createGamesDto: CreateGamesDto): Games | Promise<Games>;
    createRecordSession(createRecordSessionKqjDto: CreateRecordSessionKqjDto): RecordSessionKqj | Promise<RecordSessionKqj>;
    createTransactionSession(createTransactionSessionDto: CreateTransactionSessionDto): TransactionSession | Promise<TransactionSession>;
    deleteUser(adminId: number, userId: number): boolean | Promise<boolean>;
    markSessionAsCompleted(gameSessionId: number): boolean | Promise<boolean>;
    refreshAccessToken(refreshToken: string, token: string): Token | Promise<Token>;
    resetPassword(resetPasswordDto: ResetPasswordDto): string | Promise<string>;
    suspendUser(suspendUserDto: SuspendUserDto): User | Promise<User>;
    updateGameSession(id: number, updateGameSessionDto: UpdateGameSessionDto): GameSession | Promise<GameSession>;
    updateGames(updateGamesDto: UpdateGamesDto): Games | Promise<Games>;
    updateUser(id: number, updateUserDto: UpdateUserDto): User | Promise<User>;
    updateUserRecordStatus(gameSessionId: number, recordStatus: RecordSessionStatus, userId: number): RecordSessionKqj | Promise<RecordSessionKqj>;
    updateWallet(adminId: number, userId: number, walletData: WalletDto): Transaction | Promise<Transaction>;
    userSignUp(signUpCredential: SignUpCredential): User | Promise<User>;
}

export interface PaginatedGameSessionKqjDto {
    count: number;
    data: GameSession[];
    skip: number;
    take: number;
}

export interface PaginatedGamesDto {
    count: number;
    data: Games[];
    skip: number;
    take: number;
}

export interface PaginatedUserDto {
    count: number;
    data: User[];
    skip: number;
    take: number;
}

export interface ProfitAndLoss {
    loss: number;
    net: number;
    profit: number;
}

export interface IQuery {
    getAllGameSessions(skip: number, take: number): PaginatedGameSessionKqjDto | Promise<PaginatedGameSessionKqjDto>;
    getAllGameses(skip: number, take: number): PaginatedGamesDto | Promise<PaginatedGamesDto>;
    getAllRecordSessions(): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getAllRecordsBy(SessionId: number): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getAllTransactionSessions(): TransactionSession[] | Promise<TransactionSession[]>;
    getAllUsers(skip: number, take: number): PaginatedUserDto | Promise<PaginatedUserDto>;
    getCurrentRunningSessions(): GameSession[] | Promise<GameSession[]>;
    getDailyWinnersAndLosers(): DailyWinnersAndLosers | Promise<DailyWinnersAndLosers>;
    getFinishedSessionsToday(): number | Promise<number>;
    getGameSessionBy(id: number): GameSession | Promise<GameSession>;
    getGameSessionsByDateOrToday(filter?: Nullable<DateFilterDto>): GameSession[] | Promise<GameSession[]>;
    getGamesBy(id: number): Games | Promise<Games>;
    getGamesByDate(filter?: Nullable<DateFilterDto>): Games[] | Promise<Games[]>;
    getLiveGameSessions(): GameSession[] | Promise<GameSession[]>;
    getProfitAndLoss(): ProfitAndLoss | Promise<ProfitAndLoss>;
    getRecordSessionBy(id: number): RecordSessionKqj | Promise<RecordSessionKqj>;
    getRecordsBy(UserId: number): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getRecordsByDate(filter?: Nullable<DateFilterDto>): RecordSessionKqj[] | Promise<RecordSessionKqj[]>;
    getTotalSessionsToday(): number | Promise<number>;
    getTotalTokensToday(): number | Promise<number>;
    getTotalUsersToday(): number | Promise<number>;
    getTransactionSessionBy(id: number): TransactionSession | Promise<TransactionSession>;
    getTransactionsByDate(filter?: Nullable<DateFilterDto>): TransactionSession[] | Promise<TransactionSession[]>;
    getTransactionsByUserId(userId: number): TransactionSession[] | Promise<TransactionSession[]>;
    getUpcomingSessions(): GameSession[] | Promise<GameSession[]>;
    getUserById(id: number): User | Promise<User>;
    getUserByRole(role: number): User[] | Promise<User[]>;
    getUsersByCreatedAt(date: DateTime): User[] | Promise<User[]>;
    searchUser(filters: UserFiltersInput, skip: number, take: number): PaginatedUserDto | Promise<PaginatedUserDto>;
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
    messages: Message[];
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
    address?: Nullable<string>;
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
    phone_number: string;
    profile?: Nullable<string>;
    record_session_kqj: RecordSessionKqj;
    role: Role;
    roomMember: Room;
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

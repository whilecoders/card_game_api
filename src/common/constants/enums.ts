/* eslint-disable no-unused-vars */
export enum Role {
  SYSTEM = 'SYSTEM',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  MASTER = 'MASTER',
  ANNOUNCER = 'ANNOUNCER',
  USER = 'USER',
  GUEST = 'GUEST',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum GameResultStatus {
  WIN = 'WIN',
  LOSS = 'LOSS',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum GameStatus {
  AVAILABLE = 'AVAILABLE',
  FINISHED = 'FINISHED',
  UPCOMING = 'UPCOMING',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum GameSessionStatus {
  LIVE = 'LIVE',
  END = 'END',
  UPCOMING = 'UPCOMING',
  INACTIVE = 'INACTIVE',
}

export enum RecordSessionStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum GameKqjCards {
  JACK_OF_SPADES = 'JACK_OF_SPADES',
  QUEEN_OF_SPADES = 'QUEEN_OF_SPADES',
  KING_OF_SPADES = 'KING_OF_SPADES',
  JACK_OF_HEARTS = 'JACK_OF_HEARTS',
  QUEEN_OF_HEARTS = 'QUEEN_OF_HEARTS',
  KING_OF_HEARTS = 'KING_OF_HEARTS',
  JACK_OF_DIAMONDS = 'JACK_OF_DIAMONDS',
  QUEEN_OF_DIAMONDS = 'QUEEN_OF_DIAMONDS',
  KING_OF_DIAMONDS = 'KING_OF_DIAMONDS',
  JACK_OF_CLUBS = 'JACK_OF_CLUBS',
  QUEEN_OF_CLUBS = 'QUEEN_OF_CLUBS',
  KING_OF_CLUBS = 'KING_OF_CLUBS',
  KING = 'KING',
  QUEEN = 'QUEEN',
  JACK = 'JACK',
  SPADES = 'SPADES',
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
}

export enum GameRouletteNumbers {
  TWO = 2,
  ONE = 1,
  SIX = 6,
  SEVEN = 7,
  EIGTH = 8,
  NINE = 9,
  TEN = 10,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export enum TokenValues {
  TOKEN_11 = 11,
  TOKEN_55 = 55,
  TOKEN_110 = 110,
  TOKEN_100 = 100,
  TOKEN_550 = 550,
  TOKEN_1100 = 1100,
  TOKEN_5500 = 5500,
}

export enum GameType {
  KQJ = 'KQJ',
  ROULETTE = 'ROULETTE',
}

export enum AuditActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum AuditEntityType {
  User = 'User',
  Game = 'Game',
  DailyGame = 'DailyGame',
  GameSession = 'GameSession',
  Transaction = 'Transaction',
}

export enum PermissionAction {
  CREATEGAME = 'CREATEGAME',
  UPDATEGAME = 'UPDATEGAME',
  DELETEGAME = 'DELETEGAME',
  CREATETRANSACTION = 'CREATETRANSACTION',
  UPDATETRANSACTION = 'UPDATETRANSACTION',
  DELETETRANSACTION = 'DELETETRANSACTION',
  CREATERECORD = 'CREATERECORD',
  UPDATERECORD = 'UPDATERECORD',
  DELETERECORD = 'DELETERECORD',
  GETUSERBYID = 'GETUSERBYID',
  GETGAMERESULTBYID = 'GETGAMERESULTBYID',
}

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export enum Role {
  SYSTEM = 'SYSTEM',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  MASTER = 'MASTER',
  USER = 'USER',
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

export enum UserGameResultStatus {
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

export enum RecordStatus {
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
}

export enum TokenValues {
  TOKEN_11 = 11,
  TOKEN_55 = 55,
  TOKEN_110 = 110,
  TOKEN_550 = 550,
  TOKEN_1100 = 1100,
  TOKEN_5500 = 5500,
}

export enum GameType {
  KQJ = 'KQJ',
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
}

export enum Role {
  SYSTEM,
  SUPERADMIN,
  ADMIN,
  MASTER,
  USER,
}

export enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}

export enum TransactionType {
  CREDIT,
  DEBIT,
}

export enum Status {
  ACTIVE,
  INACTIVE,
}

export enum GameStatus {
  AVAILABLE,
  FINISHED,
  UPCOMING,
  UNAVAILABLE,
}

export enum GameSessionStatus {
  LIVE,
  END,
  UPCOMING,
  INACTIVE,
}

export enum RecordStatus {
  ACTIVE,
  SUSPENDED,
  COMPLETED,
}

export enum TransactionStatus {
  PENDING,
  SUCCESSFUL,
  FAILED,
  CANCELLED,
}

export enum GameKqjCards {
  JACK_OF_SPADES,
  QUEEN_OF_SPADES,
  KING_OF_SPADES,
  JACK_OF_HEARTS,
  QUEEN_OF_HEARTS,
  KING_OF_HEARTS,
  JACK_OF_DIAMONDS,
  QUEEN_OF_DIAMONDS,
  KING_OF_DIAMONDS,
  JACK_OF_CLUBS,
  QUEEN_OF_CLUBS,
  KING_OF_CLUBS,
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
  KQJ,
}

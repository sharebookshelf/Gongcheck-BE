export interface CreateBook {
  title: string;
  author: string;
  publisher: string;
  titleUrl: string | '';
  // TODO: AI 서버 수정 이후 추가할 데이터
  eaAddCode: string;
  setAddCode: string;
  eaIsbn: string | '';
  setIsbn: string | '';
}

export interface UserInfo {
  nickname: string;
  birth: string;
  gender: string;
  userId: string;
}

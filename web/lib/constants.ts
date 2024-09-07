type BodyParts = {
  id: number;
  name: string;
};

// データベースと同じ値を持つ定数
export const BODY_PARTS: BodyParts[] = [
  { id: 1, name: "コア" },
  { id: 2, name: "腕" },
  { id: 3, name: "背中" },
  { id: 4, name: "胸" },
  { id: 5, name: "脚" },
  { id: 6, name: "肩" },
];


export const statusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

import { User, UnitUser, Users } from "./users.interface";
import bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import fs from "fs";
import { pool } from "../db/database";

let users: Users = loadUsers();

function loadUsers(): Users {
  try {
    const data = fs.readFileSync("./users.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error ${error}`);
    return {};
  }
}

function saveUsers() {
  try {
    fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
    console.log(`Users saved xxx successfully!`);
  } catch (error) {
    console.log(`Error : ${error}`);
  }
}

export const findAll = async (): Promise<UnitUser[]> => Object.values(users);

export const findOne = async (id: string): Promise<UnitUser> => users[id];

export const create = async (userData: UnitUser): Promise<UnitUser | null> => {
  let id = random();

  let check_user = await findOne(id);

  while (check_user) {
    id = random();
    check_user = await findOne(id);
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user: UnitUser = {
    id: id,
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
  };

  users[id] = user;

  saveUsers();

  return user;
};

// ユーザーデータの取得
export const findByEmail = async (
  user_email: string
): Promise<null | UnitUser> => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [user_email];

  try {
    const res = await pool.query(query, values);

    // emailが存在しない場合
    if (res.rows.length === 0) {
      return null;
    }

    // emailに対応するusernameが見つからない場合
    // if (!res.rows[0].username) {
    //   return null;
    // }

    // user dataの作成
    const user: UnitUser = {
      id: res.rows[0].id,
      username: res.rows[0].username,
      email: res.rows[0].email,
      password: res.rows[0].password, // パスワードも含めて返す場合
    };

    return user;
  } catch (err) {
    console.error(err);

    return null;
  }
};

export const comparePassword = async (
  email: string,
  supplied_password: string
): Promise<null | UnitUser> => {
  const user = await findByEmail(email);

  // 復号化したpasswordの照合
  const isMatchDecryptPassword = await bcrypt.compare(
    supplied_password,
    user!.password
  );

  if (!isMatchDecryptPassword) {
    return null;
  }

  return user;
};

export const update = async (
  id: string,
  updateValues: User
): Promise<UnitUser | null> => {
  const userExists = await findOne(id);

  if (!userExists) {
    return null;
  }

  if (updateValues.password) {
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(updateValues.password, salt);

    updateValues.password = newPass;
  }

  users[id] = {
    ...userExists,
    ...updateValues,
  };

  saveUsers();

  return users[id];
};

export const remove = async (id: string): Promise<null | void> => {
  const user = await findOne(id);

  if (!user) {
    return null;
  }

  delete users[id];

  saveUsers();
};

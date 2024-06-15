import { User, UnitUser, Users } from "./users.interface";
import bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import fs from "fs";
import { pool } from "../db/database";
import jwt from "jsonwebtoken";

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

export const findOne = async (id: string): Promise<UnitUser> => users[id];

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

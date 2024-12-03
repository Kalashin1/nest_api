import { DataSource } from "typeorm";
import { User } from "./entity/user";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  synchronize: false,
  entities: [User],
});

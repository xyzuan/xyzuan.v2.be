import { User } from "@prisma/client";

import { prisma } from "@utils/prismaDatabase";

export class UserService {
  async createUser(username: string, password: string): Promise<User> {
    return prisma.user.create({
      data: {
        username,
        password,
      },
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async updateUser(
    id: number,
    username?: string,
    password?: string
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        username,
        password,
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

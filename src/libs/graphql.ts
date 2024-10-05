import { PubSub } from "graphql-subscriptions";
import { prismaClient } from "./prismaDatabase";
import { gql } from "@elysiajs/apollo";

const pubsub = new PubSub();
const typeDefs = gql`
  type Message {
    id: String!
    message: String!
    createdAt: String!
    isShow: Boolean
    user: User!
  }

  type User {
    id: String!
    name: String
    iconUrl: String
    isAdmin: Boolean
    messages: [Message]
  }

  type Query {
    messages: [Message]
  }

  type Mutation {
    addMessage(content: String!, userId: String!): Message
  }

  type Subscription {
    messages: Message
  }
`;

const resolvers = {
  Query: {
    messages: async () => {
      return await prismaClient.message.findMany({
        include: { user: true },
      });
    },
  },
  Mutation: {
    addMessage: async (_, { content, userId }) => {
      const newMessage = await prismaClient.message.create({
        data: {
          message: content,
          userId: userId,
        },
        include: { user: true },
      });
      pubsub.publish("MESSAGE_ADDED", { messages: newMessage });
      return newMessage;
    },
  },

  Subscription: {
    messages: {
      subscribe: async (parent, args, { pubsub }) => {
        return pubsub.asyncIterator("MESSAGE_ADDED");
      },
    },
  },
};

export { pubsub, typeDefs, resolvers };

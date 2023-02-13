import { PostConfirmationTriggerEvent } from "aws-lambda";

type userAccount = {
  PK: string;
  SK: string;
  balance: number;
  shares: number;
};

exports.handler = (event: PostConfirmationTriggerEvent) => {
  const item: userAccount = {
    PK: `U#${event.request.userAttributes.email}`,
    SK: `U#${event.request.userAttributes.email}`,
    balance: 0,
    shares: 0,
  };
  console.log(item);
  return event;
};

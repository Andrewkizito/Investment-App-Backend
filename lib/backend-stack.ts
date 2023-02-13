import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import path = require("path");

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*-----------------------------------------------------------------*/
    /*--------------------------Amplify Setup--------------------------*/
    /*-----------------------------------------------------------------*/
    const feroxAmplifyApp = new amplify.CfnApp(this, "Ferox-Amplify-App", {
      name: "Ferox-Investment",
    });
    /*------------------------------------------------------------------*/
    /*--------------------------Database Setup--------------------------*/
    /*------------------------------------------------------------------*/
    const feroxDatabase = new dynamodb.Table(this, "Ferox-Database", {
      tableName: "Ferox-Dev",
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: "expiry",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
    /*-----------------------------------------------------------------*/
    /*--------------------------Cognito Setup--------------------------*/
    /*-----------------------------------------------------------------*/
    const feroxUserPool = new cognito.UserPool(this, "Ferox-Auth-UserPool", {
      userPoolName: "Ferox",
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireSymbols: true,
        requireUppercase: true,
        requireLowercase: true,
      },
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Confirm Your Account",
        emailBody:
          "Welcome to Ferox, let's tart your investment jpourney by confirming your account.Your verification code is {####}",
      },
      accountRecovery: 0,
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        otp: true,
        sms: true,
      },
      lambdaTriggers: {
        postConfirmation: new lambda.Function(this, "Confirm-Account-Trigger", {
          functionName: "feroxConfirmSignUp",
          handler: "onSignUp.handler",
          code: lambda.Code.fromAsset(
            path.join(__dirname, "..", "app", "functions", "auth")
          ),
          runtime: lambda.Runtime.NODEJS_18_X,
          architecture: lambda.Architecture.ARM_64,
          environment: {
            TABLE_NAME: feroxDatabase.tableName,
          },
        }),
      },
    });
    feroxUserPool.addClient("Ferox-Auth-UserPoolClient", {
      idTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.hours(6),
    });
  }
}

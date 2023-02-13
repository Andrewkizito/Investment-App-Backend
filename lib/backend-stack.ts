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
  }
}

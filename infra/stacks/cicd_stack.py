from aws_cdk import Stack, CfnOutput, aws_iam as iam, aws_s3 as s3, aws_cloudfront as cloudfront, aws_ec2 as ec2
from constructs import Construct

class CicdStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        project_name: str,
        github_owner: str,
        github_repo: str,
        frontend_bucket: s3.IBucket,
        distribution: cloudfront.IDistribution,
        backend_instance: ec2.IInstance,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        provider = iam.OpenIdConnectProvider(
            self,
            "GitHubOidcProvider",
            url="https://token.actions.githubusercontent.com",
            client_ids=["sts.amazonaws.com"]
        )

        condition = {
            "StringEquals": {
                "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
            },
            "StringLike": {
                "token.actions.githubusercontent.com:sub": f"repo:{github_owner}/{github_repo}:*"
            }
        }

        frontend_role = iam.Role(
            self,
            "GitHubFrontendDeployRole",
            assumed_by=iam.WebIdentityPrincipal(
                provider.open_id_connect_provider_arn,
                conditions=condition
            )
        )

        frontend_bucket.grant_read_write(frontend_role)
        frontend_role.add_to_policy(iam.PolicyStatement(
            actions=["cloudfront:CreateInvalidation"],
            resources=["*"]
        ))

        backend_role = iam.Role(
            self,
            "GitHubBackendDeployRole",
            assumed_by=iam.WebIdentityPrincipal(
                provider.open_id_connect_provider_arn,
                conditions=condition
            )
        )

        backend_role.add_to_policy(iam.PolicyStatement(
            actions=["ssm:SendCommand", "ssm:GetCommandInvocation", "ssm:ListCommandInvocations"],
            resources=["*"]
        ))
        backend_role.add_to_policy(iam.PolicyStatement(
            actions=["ec2:DescribeInstances"],
            resources=["*"]
        ))

        CfnOutput(self, "GitHubFrontendDeployRoleArn", value=frontend_role.role_arn)
        CfnOutput(self, "GitHubBackendDeployRoleArn", value=backend_role.role_arn)

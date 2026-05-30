from aws_cdk import Stack, Duration, RemovalPolicy, CfnOutput, aws_ec2 as ec2, aws_rds as rds
from constructs import Construct

class DatabaseStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        project_name: str,
        vpc: ec2.IVpc,
        db_sg: ec2.ISecurityGroup,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.db = rds.DatabaseInstance(
            self,
            "MysqlDatabase",
            engine=rds.DatabaseInstanceEngine.mysql(
                version=rds.MysqlEngineVersion.VER_8_4_8
            ),
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_group_name="db"),
            security_groups=[db_sg],
            instance_type=ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            allocated_storage=20,
            max_allocated_storage=50,
            multi_az=False,
            publicly_accessible=False,
            credentials=rds.Credentials.from_generated_secret("admin"),
            database_name="fruitharvest",
            backup_retention=Duration.days(1),
            deletion_protection=False,
            removal_policy=RemovalPolicy.DESTROY
        )

        self.db_secret = self.db.secret

        CfnOutput(self, "DbEndpoint", value=self.db.db_instance_endpoint_address)
        CfnOutput(self, "DbSecretArn", value=self.db_secret.secret_arn)

from aws_cdk import (
    Stack,
    CfnOutput,
    Tags,
    aws_ec2 as ec2,
    aws_iam as iam,
    aws_s3 as s3,
    aws_secretsmanager as secretsmanager,
    aws_elasticloadbalancingv2 as elbv2,
    aws_elasticloadbalancingv2_targets as targets
)
from constructs import Construct

class BackendStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        project_name: str,
        vpc: ec2.IVpc,
        alb_sg: ec2.ISecurityGroup,
        web_sg: ec2.ISecurityGroup,
        image_bucket: s3.IBucket,
        db_secret: secretsmanager.ISecret,
        github_owner: str,
        github_repo: str,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.web_sg = web_sg

        role = iam.Role(
            self,
            "BackendEc2Role",
            assumed_by=iam.ServicePrincipal("ec2.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name("AmazonSSMManagedInstanceCore"),
                iam.ManagedPolicy.from_aws_managed_policy_name("CloudWatchAgentServerPolicy"),
            ],
        )

        image_bucket.grant_read_write(role)
        db_secret.grant_read(role)

        user_data = ec2.UserData.for_linux()
        user_data.add_commands(
            "set -xe",
            "dnf update -y",
            "dnf install -y git jq",
            "curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -",
            "dnf install -y nodejs",
            "npm install -g pm2",
            "mkdir -p /opt/fruitharvest",
            "cd /opt/fruitharvest",
            f"git clone https://github.com/{github_owner}/{github_repo}.git . || true",
            "cd backend || exit 1",
            "cat > .env <<ENVEOF",
            f"AWS_REGION={self.region}",
            f"IMAGE_BUCKET={image_bucket.bucket_name}",
            f"DB_SECRET_ARN={db_secret.secret_arn}",
            "PORT=3000",
            "ENVEOF",
            "npm install",
            "npm run init-db || true",
            "pm2 start app.js --name fruitharvest-backend || pm2 restart fruitharvest-backend",
            "pm2 save",
            "pm2 startup systemd -u root --hp /root || true"
        )

        self.instance = ec2.Instance(
            self,
            "BackendInstance",
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_group_name="app"),
            instance_type=ec2.InstanceType("t3.micro"),
            machine_image=ec2.MachineImage.latest_amazon_linux2023(),
            role=role,
            security_group=self.web_sg,
            user_data=user_data
        )

        Tags.of(self.instance).add("Application", project_name)
        Tags.of(self.instance).add("Role", "Backend")
        Tags.of(self.instance).add("Name", f"{project_name}-Backend")

        self.alb = elbv2.ApplicationLoadBalancer(
            self,
            "BackendAlb",
            vpc=vpc,
            internet_facing=True,
            security_group=alb_sg
        )

        listener = self.alb.add_listener("HttpListener", port=80, open=True)

        listener.add_targets(
            "BackendTarget",
            port=3000,
            protocol=elbv2.ApplicationProtocol.HTTP,
            targets=[targets.InstanceTarget(self.instance, port=3000)],
            health_check=elbv2.HealthCheck(path="/health", port="3000", healthy_http_codes="200")
        )

        CfnOutput(self, "BackendAlbDns", value=self.alb.load_balancer_dns_name)
        CfnOutput(self, "BackendInstanceId", value=self.instance.instance_id)

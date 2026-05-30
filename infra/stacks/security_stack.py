from aws_cdk import Stack, aws_ec2 as ec2
from constructs import Construct

class SecurityStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, project_name: str, vpc: ec2.IVpc, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.alb_sg = ec2.SecurityGroup(
            self,
            "AlbSecurityGroup",
            vpc=vpc,
            allow_all_outbound=True,
            description="Allow internet HTTP to ALB"
        )
        self.alb_sg.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(80), "HTTP from internet")

        self.web_sg = ec2.SecurityGroup(
            self,
            "BackendEc2SecurityGroup",
            vpc=vpc,
            allow_all_outbound=True,
            description="Allow ALB to Node.js backend"
        )
        self.web_sg.add_ingress_rule(self.alb_sg, ec2.Port.tcp(3000), "Node.js from ALB")

        self.db_sg = ec2.SecurityGroup(
            self,
            "DatabaseSecurityGroup",
            vpc=vpc,
            allow_all_outbound=True,
            description="Allow MySQL from backend"
        )
        self.db_sg.add_ingress_rule(self.web_sg, ec2.Port.tcp(3306), "MySQL from backend EC2")

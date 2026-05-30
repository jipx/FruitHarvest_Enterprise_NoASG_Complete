from aws_cdk import Stack, Duration, CfnOutput, aws_cloudwatch as cloudwatch, aws_elasticloadbalancingv2 as elbv2, aws_ec2 as ec2, aws_rds as rds
from constructs import Construct

class MonitoringStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        project_name: str,
        alb: elbv2.ApplicationLoadBalancer,
        instance: ec2.Instance,
        db: rds.DatabaseInstance,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        dashboard = cloudwatch.Dashboard(
            self,
            "Dashboard",
            dashboard_name=f"{project_name}-NoASG-Dashboard"
        )

        ec2_cpu = cloudwatch.Metric(
            namespace="AWS/EC2",
            metric_name="CPUUtilization",
            dimensions_map={"InstanceId": instance.instance_id},
            statistic="Average",
            period=Duration.minutes(5)
        )

        rds_cpu = db.metric_cpu_utilization(period=Duration.minutes(5))

        alb_requests = cloudwatch.Metric(
            namespace="AWS/ApplicationELB",
            metric_name="RequestCount",
            dimensions_map={
                "LoadBalancer": alb.load_balancer_full_name
            },
            statistic="Sum",
            period=Duration.minutes(5)
        )

        dashboard.add_widgets(
            cloudwatch.GraphWidget(title="Backend EC2 CPU", left=[ec2_cpu]),
            cloudwatch.GraphWidget(title="RDS CPU", left=[rds_cpu]),
            cloudwatch.GraphWidget(title="ALB Requests", left=[alb_requests])
        )

        CfnOutput(self, "DashboardName", value=dashboard.dashboard_name)

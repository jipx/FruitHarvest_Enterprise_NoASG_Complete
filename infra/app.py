#!/usr/bin/env python3
import os
from aws_cdk import App, Environment

from stacks.network_stack import NetworkStack
from stacks.security_stack import SecurityStack
from stacks.storage_stack import StorageStack
from stacks.auth_stack import AuthStack
from stacks.database_stack import DatabaseStack
from stacks.backend_stack import BackendStack
from stacks.frontend_stack import FrontendStack
from stacks.cicd_stack import CicdStack
from stacks.monitoring_stack import MonitoringStack

app = App()

project_name = app.node.try_get_context("project_name") or "FruitHarvest"
region = app.node.try_get_context("region") or os.environ.get("CDK_DEFAULT_REGION") or "ap-southeast-1"
account = os.environ.get("CDK_DEFAULT_ACCOUNT")
github_owner = app.node.try_get_context("github_owner") or "REPLACE_GITHUB_OWNER"
github_repo = app.node.try_get_context("github_repo") or "REPLACE_GITHUB_REPO"

env = Environment(account=account, region=region)

network = NetworkStack(app, f"{project_name}NetworkStack", project_name=project_name, env=env)
security = SecurityStack(app, f"{project_name}SecurityStack", project_name=project_name, vpc=network.vpc, env=env)
storage = StorageStack(app, f"{project_name}StorageStack", project_name=project_name, env=env)
auth = AuthStack(app, f"{project_name}AuthStack", project_name=project_name, env=env)

database = DatabaseStack(
    app,
    f"{project_name}DatabaseStack",
    project_name=project_name,
    vpc=network.vpc,
    db_sg=security.db_sg,
    env=env
)

backend = BackendStack(
    app,
    f"{project_name}BackendStack",
    project_name=project_name,
    vpc=network.vpc,
    alb_sg=security.alb_sg,
    web_sg=security.web_sg,
    image_bucket=storage.image_bucket,
    db_secret=database.db_secret,
    github_owner=github_owner,
    github_repo=github_repo,
    env=env
)

frontend = FrontendStack(
    app,
    f"{project_name}FrontendStack",
    project_name=project_name,
    backend_url=f"http://{backend.alb.load_balancer_dns_name}",
    user_pool=auth.user_pool,
    user_pool_client=auth.user_pool_client,
    env=env
)

CicdStack(
    app,
    f"{project_name}CicdStack",
    project_name=project_name,
    github_owner=github_owner,
    github_repo=github_repo,
    frontend_bucket=frontend.frontend_bucket,
    distribution=frontend.distribution,
    backend_instance=backend.instance,
    env=env
)

MonitoringStack(
    app,
    f"{project_name}MonitoringStack",
    project_name=project_name,
    alb=backend.alb,
    instance=backend.instance,
    db=database.db,
    env=env
)

app.synth()

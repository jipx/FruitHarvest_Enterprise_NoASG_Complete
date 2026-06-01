# FruitHarvest Enterprise - No ASG Complete CDK

This project deploys a FruitHarvest enterprise teaching application without Auto Scaling Group, avoiding the AWS Launch Configuration error.

## Architecture

- VPC with public, app, and isolated DB subnets
- Application Load Balancer in public subnets
- Single EC2 t3.micro Node.js backend in private app subnet
- RDS MySQL 8.4.8 in isolated DB subnet
- S3 bucket for product images
- S3 + CloudFront for frontend
- Cognito user pool
- GitHub Actions OIDC roles
- Backend deployment using SSM SendCommand
- CloudWatch dashboard
- Enterprise database schema and seed data

## Deploy

```powershell
cd infra

python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1

pip install -r requirements.txt

cdk bootstrap aws://YOUR_ACCOUNT_ID/ap-southeast-1

cdk deploy --all `
  -c github_owner=jipx `
  -c github_repo=FruitHarvest_Enterprise_NoASG_Complete `
  -c region=ap-southeast-1
```

## Local Backend

```bash
cd backend
npm install
npm run dev
```

## Local Frontend

```bash
cd frontend
npm install
npm run dev
```

## Important

Set these GitHub Actions secrets or repository variables after deployment:

- `AWS_REGION`
- `FRONTEND_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `BACKEND_ALB_DNS`
- IAM role ARNs from CDK output
- FRONTEND_DEPLOY_ROLE_ARN
- BACKEND_DEPLOY_ROLE_ARN

#frontend url
- https://d1gwe097rikkst.cloudfront.net/

#backend API
- 
from aws_cdk import Stack, RemovalPolicy, CfnOutput, aws_s3 as s3
from constructs import Construct

class StorageStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, project_name: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.image_bucket = s3.Bucket(
            self,
            "ProductImagesBucket",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            versioned=True,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True
        )

        CfnOutput(self, "ImageBucketName", value=self.image_bucket.bucket_name)

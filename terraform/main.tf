terraform {
  required_version = ">= 1.0.0"

  backend "s3" {
    # catch bucket name from CI/CD
    key     = "terraform.tfstate"
    region  = "eu-central-1"
    encrypt = true

    # Enable S3 Native Locking
    use_lockfile = true
  }
}

# Call the ECR module
module "ecr" {
  source = "./modules/aws/ecr"
  repo_name = "${var.project_name}-repo"
}

# Call the RDS module
module "rds" {
  source       = "./modules/aws/rds"
  project_name = var.project_name

  db_name = var.db_name
  db_username = var.db_username
  db_password  = var.db_password

  # No VPC to make Lambda talk to external APIs directly
  publicly_accessible               = false
  iam_database_authentication_enabled = true
}

# Call the Lambda module
module "api_lambda" {
  source = "./modules/aws/lambda"
  function_name = "${var.project_name}-api"
  api_image_uri = var.api_image_uri
  db_url      = "jdbc:postgresql://${module.rds.db_endpoint}/${var.db_name}"
  db_username = var.db_username
  db_password = var.db_password
  gemini_api_key = var.gemini_api_key
}

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

# Data sources
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security
resource "aws_security_group" "app_sg" {
  name   = "${var.project_name}-common-sg"
  vpc_id = data.aws_vpc.default.id

  # Allow the app to talk to itself (Lambda -> RDS) on the Postgres port
  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    self      = true
  }

  # Allow the app to talk to the internet (for logs and updates)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
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

  # Pass the security group to RDS
  vpc_security_group_ids = [aws_security_group.app_sg.id]
}

# Call the Lambda module
module "api_lambda" {
  source = "./modules/aws/lambda"
  function_name = "${var.project_name}-api"
  api_image_uri = var.api_image_uri

  # Pass the JDBC URL dynamically
  db_url      = "jdbc:postgresql://${module.rds.db_endpoint}/${var.db_name}"
  db_username = var.db_username
  db_password = var.db_password

  # Pass the networking IDs to Lambda
  vpc_subnet_ids     = data.aws_subnets.default.ids
  vpc_security_group_ids = [aws_security_group.app_sg.id]
}

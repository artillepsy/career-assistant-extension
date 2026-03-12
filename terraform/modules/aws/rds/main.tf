resource "aws_db_instance" "postgres" {
  identifier           = "${var.project_name}-db"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.micro" # Free Tier eligible, compatible with arm64 processors
  allocated_storage    = 20             # Max free storage (gp2)
  storage_type         = "gp2"
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password

  #todo: set to 'true' when ready to work with DB 
  publicly_accessible  = false
  iam_database_authentication_enabled = true
  skip_final_snapshot  = true  # Required to destroy without errors
  multi_az             = false # Multi-AZ is NOT free

}
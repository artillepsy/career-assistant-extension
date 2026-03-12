variable "project_name" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
  sensitive = true
}

variable "publicly_accessible" {
  type    = bool
  default = false
}

variable "iam_database_authentication_enabled" {
  type    = bool
  default = false
}
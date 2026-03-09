resource "aws_lambda_function" "this" {
  function_name = var.function_name
  role = aws_iam_role.lambda_exec.arn
  package_type = "Image"
  image_uri = var.api_image_uri

  architectures = ["arm64"]
  memory_size = var.memory_size
  timeout = 30

  # Environment block to enable AOT loading and Tiered Compilation
  environment {
    variables = {
      ASPNETCORE_ENVIRONMENT = "Production"

      DB_URL      = var.db_url
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      
      GEMINI_API_KEY = var.gemini_api_key
    }
  }

  vpc_config {
    subnet_ids         = var.vpc_subnet_ids
    security_group_ids = var.vpc_security_group_ids
  }
}

resource "aws_lambda_alias" "live" {
  name = "live"
  function_name = aws_lambda_function.this.function_name
  function_version = aws_lambda_function.this.version
}

resource "aws_lambda_function_url" "api_url" {
  function_name = aws_lambda_function.this.function_name

  qualifier = aws_lambda_alias.live.name
  authorization_type = "NONE"

  # todo: configure origins later, when the extension is ready to test
  cors {
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}

# Permission: Allow the URL specifically
resource "aws_lambda_permission" "url_permission" {
  statement_id           = "AllowFunctionURL"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.this.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
  qualifier              = aws_lambda_alias.live.name
}

# Permission: Allow general invocation for the public principal
resource "aws_lambda_permission" "public_invoke" {
  statement_id  = "AllowPublicInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "*"
  qualifier     = aws_lambda_alias.live.name
}
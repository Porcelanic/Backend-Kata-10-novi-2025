# Common environment variables for all Lambda functions
locals {
  lambda_env_vars = {
    DB_HOST             = aws_db_instance.postgres.address
    DB_PORT             = aws_db_instance.postgres.port
    DB_NAME             = var.db_name
    DB_USER             = var.db_username
    DB_PASSWORD         = var.db_password
    SENDGRID_API_KEY    = var.sendgrid_api_key
    SENDGRID_FROM_EMAIL = var.sendgrid_from_email
  }
}

# Lambda Function - Usuario
resource "aws_lambda_function" "usuario" {
  filename         = "../dist/usuario.zip"
  function_name    = "${var.project_name}-usuario"
  role             = aws_iam_role.lambda_role.arn
  handler          = "modules/usuario/handler.handler"
  source_code_hash = filebase64sha256("../dist/usuario.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-usuario"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# Lambda Function - Solicitud
resource "aws_lambda_function" "solicitud" {
  filename         = "../dist/solicitud.zip"
  function_name    = "${var.project_name}-solicitud"
  role             = aws_iam_role.lambda_role.arn
  handler          = "modules/solicitud/handler.handler"
  source_code_hash = filebase64sha256("../dist/solicitud.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-solicitud"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# CloudWatch Log Group for Usuario Lambda
resource "aws_cloudwatch_log_group" "usuario" {
  name              = "/aws/lambda/${aws_lambda_function.usuario.function_name}"
  retention_in_days = 7
}

# CloudWatch Log Group for Solicitud Lambda
resource "aws_cloudwatch_log_group" "solicitud" {
  name              = "/aws/lambda/${aws_lambda_function.solicitud.function_name}"
  retention_in_days = 7
}

# Lambda Function - Historico
resource "aws_lambda_function" "historico" {
  filename         = "../dist/historico.zip"
  function_name    = "${var.project_name}-historico"
  role             = aws_iam_role.lambda_role.arn
  handler          = "modules/historico/handler.handler"
  source_code_hash = filebase64sha256("../dist/historico.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-historico"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# CloudWatch Log Group for Historico Lambda
resource "aws_cloudwatch_log_group" "historico" {
  name              = "/aws/lambda/${aws_lambda_function.historico.function_name}"
  retention_in_days = 7
}

# Lambda Function - Solicitud Acceso
resource "aws_lambda_function" "solicitud_acceso" {
  filename         = "../dist/solicitud_acceso.zip"
  function_name    = "${var.project_name}-solicitud-acceso"
  role             = aws_iam_role.lambda_role.arn
  handler          = "modules/solicitud_acceso/handler.handler"
  source_code_hash = filebase64sha256("../dist/solicitud_acceso.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-solicitud-acceso"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# CloudWatch Log Group for Solicitud Acceso Lambda
resource "aws_cloudwatch_log_group" "solicitud_acceso" {
  name              = "/aws/lambda/${aws_lambda_function.solicitud_acceso.function_name}"
  retention_in_days = 7
}

# Lambda Function - Solicitud Despliegue
resource "aws_lambda_function" "solicitud_despliegue" {
  filename         = "../dist/solicitud_despliegue.zip"
  function_name    = "${var.project_name}-solicitud-despliegue"
  role             = aws_iam_role.lambda_role.arn
  handler          = "modules/solicitud_despliegue/handler.handler"
  source_code_hash = filebase64sha256("../dist/solicitud_despliegue.zip")
  runtime          = var.lambda_runtime
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = local.lambda_env_vars
  }

  tags = {
    Name = "${var.project_name}-solicitud-despliegue"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_execution,
    aws_iam_role_policy_attachment.lambda_basic_execution
  ]
}

# CloudWatch Log Group for Solicitud Despliegue Lambda
resource "aws_cloudwatch_log_group" "solicitud_despliegue" {
  name              = "/aws/lambda/${aws_lambda_function.solicitud_despliegue.function_name}"
  retention_in_days = 7
}

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  tags = {
    Name = "${var.project_name}-api"
  }
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true

  tags = {
    Name = "${var.project_name}-api-stage"
  }
}

# Lambda Integration - Usuario
resource "aws_apigatewayv2_integration" "usuario" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.usuario.invoke_arn
  payload_format_version = "2.0"
}

# Lambda Integration - Solicitud
resource "aws_apigatewayv2_integration" "solicitud" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.solicitud.invoke_arn
  payload_format_version = "2.0"
}

# Usuario Routes
resource "aws_apigatewayv2_route" "usuario_register" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /usuario/register"
  target    = "integrations/${aws_apigatewayv2_integration.usuario.id}"
}

resource "aws_apigatewayv2_route" "usuario_login" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /usuario/login"
  target    = "integrations/${aws_apigatewayv2_integration.usuario.id}"
}

resource "aws_apigatewayv2_route" "usuario_get_all" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /usuario"
  target    = "integrations/${aws_apigatewayv2_integration.usuario.id}"
}

resource "aws_apigatewayv2_route" "usuario_get_by_correo" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /usuario/{correo}"
  target    = "integrations/${aws_apigatewayv2_integration.usuario.id}"
}

resource "aws_apigatewayv2_route" "usuario_update" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "PUT /usuario/{correo}"
  target    = "integrations/${aws_apigatewayv2_integration.usuario.id}"
}

resource "aws_apigatewayv2_route" "usuario_delete" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /usuario/{correo}"
  target    = "integrations/${aws_apigatewayv2_integration.usuario.id}"
}

# Solicitud Routes
resource "aws_apigatewayv2_route" "solicitud_create" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /solicitud"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud.id}"
}

resource "aws_apigatewayv2_route" "solicitud_get_all" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud.id}"
}

resource "aws_apigatewayv2_route" "solicitud_get_by_id" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud.id}"
}

resource "aws_apigatewayv2_route" "solicitud_get_by_centro_costo" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud/centro_costo/{centro_costo}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud.id}"
}

resource "aws_apigatewayv2_route" "solicitud_get_by_correo" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud/correo_solicitante/{correo_solicitante}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud.id}"
}

resource "aws_apigatewayv2_route" "solicitud_update" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "PUT /solicitud/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud.id}"
}

resource "aws_apigatewayv2_route" "solicitud_delete" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /solicitud/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud.id}"
}

# Lambda Permissions for API Gateway - Usuario
resource "aws_lambda_permission" "usuario_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.usuario.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Lambda Permissions for API Gateway - Solicitud
resource "aws_lambda_permission" "solicitud_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.solicitud.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

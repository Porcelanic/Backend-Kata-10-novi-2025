# API Gateway HTTP API
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]  # En producción, especifica tus dominios exactos
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["*"]
    expose_headers = ["*"]
    max_age = 300
  }

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

# Lambda Integration - Historico
resource "aws_apigatewayv2_integration" "historico" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.historico.invoke_arn
  payload_format_version = "2.0"
}

# Lambda Integration - Solicitud Acceso
resource "aws_apigatewayv2_integration" "solicitud_acceso" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.solicitud_acceso.invoke_arn
  payload_format_version = "2.0"
}

# Lambda Integration - Solicitud Despliegue
resource "aws_apigatewayv2_integration" "solicitud_despliegue" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.solicitud_despliegue.invoke_arn
  payload_format_version = "2.0"
}

# ============================================
# USUARIO ROUTES
# ============================================
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

# ============================================
# SOLICITUD ROUTES
# ============================================
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

# ============================================
# HISTORICO ROUTES
# ============================================

resource "aws_apigatewayv2_route" "historico_create" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /historico"
  target    = "integrations/${aws_apigatewayv2_integration.historico.id}"
}

resource "aws_apigatewayv2_route" "historico_get_all" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /historico"
  target    = "integrations/${aws_apigatewayv2_integration.historico.id}"
}

resource "aws_apigatewayv2_route" "historico_get_by_id" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /historico/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.historico.id}"
}

resource "aws_apigatewayv2_route" "historico_get_by_solicitud" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /historico/solicitud/{id_solicitud}"
  target    = "integrations/${aws_apigatewayv2_integration.historico.id}"
}

resource "aws_apigatewayv2_route" "historico_get_by_aprobador" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /historico/aprobador/{correo_aprobador}"
  target    = "integrations/${aws_apigatewayv2_integration.historico.id}"
}

resource "aws_apigatewayv2_route" "historico_update" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "PUT /historico/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.historico.id}"
}

resource "aws_apigatewayv2_route" "historico_delete" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /historico/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.historico.id}"
}

# Lambda Permissions for API Gateway - Historico
resource "aws_lambda_permission" "historico_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.historico.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# ============================================
# SOLICITUD ACCESO ROUTES
# ============================================

resource "aws_apigatewayv2_route" "solicitud_acceso_create" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /solicitud-acceso"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_acceso.id}"
}

resource "aws_apigatewayv2_route" "solicitud_acceso_get_all" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud-acceso"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_acceso.id}"
}

resource "aws_apigatewayv2_route" "solicitud_acceso_get_by_id" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud-acceso/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_acceso.id}"
}

resource "aws_apigatewayv2_route" "solicitud_acceso_get_by_aplicacion" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud-acceso/aplicacion/{aplicacion}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_acceso.id}"
}

resource "aws_apigatewayv2_route" "solicitud_acceso_update" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "PUT /solicitud-acceso/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_acceso.id}"
}

resource "aws_apigatewayv2_route" "solicitud_acceso_delete" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /solicitud-acceso/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_acceso.id}"
}

# Lambda Permissions for API Gateway - Solicitud Acceso
resource "aws_lambda_permission" "solicitud_acceso_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.solicitud_acceso.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# ============================================
# SOLICITUD DESPLIEGUE ROUTES
# ============================================

resource "aws_apigatewayv2_route" "solicitud_despliegue_create" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /solicitud-despliegue"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_despliegue.id}"
}

resource "aws_apigatewayv2_route" "solicitud_despliegue_get_all" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud-despliegue"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_despliegue.id}"
}

resource "aws_apigatewayv2_route" "solicitud_despliegue_get_by_id" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud-despliegue/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_despliegue.id}"
}

resource "aws_apigatewayv2_route" "solicitud_despliegue_get_by_historia_jira" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /solicitud-despliegue/historia-jira/{historia_jira}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_despliegue.id}"
}

resource "aws_apigatewayv2_route" "solicitud_despliegue_update" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "PUT /solicitud-despliegue/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_despliegue.id}"
}

resource "aws_apigatewayv2_route" "solicitud_despliegue_delete" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /solicitud-despliegue/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.solicitud_despliegue.id}"
}

# Lambda Permissions for API Gateway - Solicitud Despliegue
resource "aws_lambda_permission" "solicitud_despliegue_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.solicitud_despliegue.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "usuario_lambda_arn" {
  description = "Usuario Lambda ARN"
  value       = aws_lambda_function.usuario.arn
}

output "solicitud_lambda_arn" {
  description = "Solicitud Lambda ARN"
  value       = aws_lambda_function.solicitud.arn
}

output "historico_lambda_arn" {
  description = "Historico Lambda ARN"
  value       = aws_lambda_function.historico.arn
}

output "solicitud_acceso_lambda_arn" {
  description = "Solicitud Acceso Lambda ARN"
  value       = aws_lambda_function.solicitud_acceso.arn
}

output "solicitud_despliegue_lambda_arn" {
  description = "Solicitud Despliegue Lambda ARN"
  value       = aws_lambda_function.solicitud_despliegue.arn
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_address" {
  description = "RDS address"
  value       = aws_db_instance.postgres.address
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

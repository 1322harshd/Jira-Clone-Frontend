terraform {
    required_providers {
      aws = { source = "hashicorp/aws", version = "~> 5.0" }
    }
    backend "s3" {
        bucket = "cd-terraform-state-bucket"
        key = "jira-clone-frontend/terraform.tfstate"
        region = "ap-southeast-2"
      
    }
}

provider "aws" {
    region = "ap-southeast-2"
}

variable "bucket_name" {
  default = "jira-clone-frontend-harsh"
}

variable "backend_domain" {
  description = "domain.com"
}

resource "aws_s3_bucket" "site" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "site" {
  name = "jira-clone-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_function" "spa_rewrite" {
    name = "jira-clone-spa-rewrite"
    runtime = "cloudfront-js-2.0"
    code = <<-EOT
        function handler(event) {
        var request = event.request;
        if (!request.uri.includes('.')) { request.uri = '/index.html'; }
        return request;
    }
    EOT
}

resource "aws_cloudfront_function" "strip_api" {
  name = "jira-clone-strip-api"
  runtime = "cloudfront-js-2.0"
  code = <<-EOT
    function handler(event) {
    var request = event.request;
    request.uri = request.uri.replace(/^\/api/, '') || '/';
    return request;
    }
  EOT
}

data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_cache_policy" "disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

resource "aws_cloudfront_distribution" "site" {
  enabled = true
  default_root_object = "index.html"

  origin {
    origin_id = "s3"
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  origin {
    origin_id = "backend"
    domain_name = var.backend_domain
    custom_origin_config {
      http_port = 3000
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }


default_cache_behavior {
    target_origin_id = "s3"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = ["GET","HEAD"]
    cached_methods = ["GET","HEAD"]
    cache_policy_id = data.aws_cloudfront_cache_policy.optimized.id
    
    function_association {
        event_type = "viewer-request"
        function_arn = aws_cloudfront_function.spa_rewrite.arn
    }
}

    ordered_cache_behavior {
        path_pattern = "/api/*"
        target_origin_id = "backend"
        viewer_protocol_policy = "redirect-to-https"
        allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
        cached_methods = ["GET","HEAD"]
        cache_policy_id = data.aws_cloudfront_cache_policy.disabled.id
        origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id

        function_association {
            event_type = "viewer_request"
            function_arn = aws_cloudfront_function.strip_api.arn
        }
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    viewer_certificate {
        cloudfront_default_certificate = true
    }

}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
        Effect = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com"}
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.site.arn}/*"
        Condition = {
            StringEquals = { "AWS: SourceArn" = aws_cloudfront_distribution.site.arn }
        }
    }]
  })
}

output "bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "site_url" {
  value = "https://${aws_cloudfront_distribution.site.domain_name}"
}
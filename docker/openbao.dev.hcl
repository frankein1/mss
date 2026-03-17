#####
## KMS initialization for docker container in local dev env
#####

api_addr = "http://0.0.0.0:8200"
log_level      = "debug"

# UI available at http://localhost:9110/ui/
ui = true

# Persistent storage data
storage "file" {
  path = "/openbao/file"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable   = 1
}

seal "static" {
  current_key_id = "20260316-1"
  current_key = "env://KMS_UNSEAL_KEY"
}

initialize "setup" {
  request "enable-auth-by-userpassword" {
    operation = "update"
    path      = "sys/auth/userpass"
    data = {
      type = "userpass"
    }
  }

  request "enable-auth-by-approle" {
    operation = "update"
    path = "sys/auth/approle"
    data = {
      type = "approle"
    }
  }

  request "activate-key-manager" {
    operation = "update"
    path = "sys/mounts/transit"
    data = {
      type = "transit"
    }
  }

  # Create local KEK with id $KMS_KEY_ID
  request "create-local-kek" {
    operation = "update"
    path = "transit/keys/mockkms-kek-id"
    data = {
      derived = false
      exportable = false
      type = "aes256-gcm96"
    }
  }

  request "setup-policy-key-manager" {
    operation = "update"
    path = "sys/policies/acl/mss-transit"
    data = {
      policy = <<EOT
path "transit/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOT
    }
  }

  request "setup-policy-super-admin" {
    operation = "update"
    path = "sys/policies/acl/super-admin"
    data = {
      policy = <<EOT
path "*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOT
    }
  }

  request "create-super-admin" {
    operation = "update"
    path      = "auth/userpass/users/admin"
    data = {
      password = "admin"
      policies = ["super-admin"]
    }
  }

  request "create-mss-app-role" {
    operation = "update"
    path = "auth/approle/role/mss-app"
    data = {
      token_policies = "mss-transit"
    }
  }

  # Create access key with $KMS_ACCESS_KEY_ID
  request "create-access-key" {
    operation = "update"
    path = "auth/approle/role/mss-app/role-id"
    data = {
      role_id = "mockkms-mss"
    }
    
  }

  # Create secret key with $KMS_SECRET_KEY
  request "create-secret-key" {
    operation = "update"
    path = "auth/approle/role/mss-app/custom-secret-id"
    data = {
      secret_id = "mockkms-local-secret-key"
    }
  }
}

#####
## KMS initialization for docker container in local dev env
#####

api_addr = "http://0.0.0.0:8200"

# Persistent storage data
storage "file" {
  path = "/openbao/file"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable   = true
}

seal "static" {
  current_key_id = "20260316-1"
  current_key = "env://KMS_UNSEAL_KEY"
}

initialize "setup" {
  # Activate Authentication by role_id,secret_id
  request "sys/auth/approle" {
    operation = "update"
    payload = {
      type = "approle"
    }
  }

  # Activate key manager
  request "sys/mounts/transit" {
    operation = "update"
    payload = {
      type = "transit"
    }
  }

  # Create local KEK with id $KMS_KEY_ID
  request "transit/keys/mockkms-kek-id" {
    operation = "update"
    payload = {
      derived = false
      exportable = false
      type = "aes256-gcm96"
    }
  }

  # Setup policy
  request "sys/policies/acl/mss-transit" {
    operation = "update"
    payload = {
      policy = "path \"transit/*\" {\n  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]\n}"
    }
  }

  # Setup Authentication
  request "auth/approle/role/mss-app" {
    operation = "update"
    payload = {
      token_policies = "mss-transit"
    }
  }

  request "auth/approle/role/mss-app/role-id" {
    operation = "update"
    payload = {
      role_id = "env://KMS_ACCESS_KEY_ID"
    }
  }

  # Set $KMS_SECRET_KEY
  request "auth/approle/role/mss-app/secret-id" {
    operation = "update"
    payload = {
      secret_id = "env://KMS_SECRET_KEY"
    }
  }
}

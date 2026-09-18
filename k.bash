$url = "$env:SUPABASE_URL/rest/v1/orders"
$key = $env:sb_publishable_Sj3k-IKT_za-uJIIFKhJog_ZK3hRX-_

$headers = @{
  apikey = $key
  Authorization = "Bearer $key"
  "Content-Type" = "application/json"
  Prefer = "return=representation"
}

$body = @{
  order_code = "TEST_" + (Get-Date -Format "yyyyMMddHHmmss")
  customer_name = "A"
  customer_phone = "0900000000"
  address = "HN"
  items = @()
  total = 0
} | ConvertTo-Json -Compress

try {
  $r = Invoke-WebRequest -Uri $url -Method Post -Headers $headers -Body $body
  "HTTP $($r.StatusCode)"
  $r.Content
} catch {
  $r = $_.Exception.Response
  if ($null -ne $r) {
    "HTTP $([int]$r.StatusCode)"
    $reader = New-Object System.IO.StreamReader($r.GetResponseStream())
    $reader.ReadToEnd()
  } else {
    $_.Exception.Message
  }
}
require 'json'
require 'net/http'
require 'net/https'

@@HEADERS = {"Accept" => "application/json", "Authorization" => "Bearer nEuDrL5pHncNakQcyTIkhQ"}

def retrieve_payments(begin_time, end_time)
  uri = URI.parse("https://connect.squareup.com/v1/me/payments")
  https = Net::HTTP.new(uri.host, uri.port)
  https.use_ssl = true
  req = Net::HTTP::Get.new(uri.path, @@HEADERS)
  req['begin_time'] = begin_time
  req['end_time'] = end_time
  res = https.request(req)

  JSON.parse(res.body)
end

def itemizations(payments)
  payments.each do |payment|
    
  end
end





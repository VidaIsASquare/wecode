require 'json'
require 'net/http'
require 'net/https'

@@HEADERS = {"Accept" => "application/json", "Authorization" => "Bearer nEuDrL5pHncNakQcyTIkhQ"}

# Returns a creator_token and the total payment amount.
# Also adds a "Total" token for all payments.
def creator_token_payment_amount_hash(begin_time = "2014-02-01", end_time = "2014-03-01")
  creator_token_amount_hash = Hash.new(0)

  payments = retrieve_payments(begin_time, end_time)

  payments.each do |payment|
    # TODO(vida): Is the creator token empty if it's the merchant account?
    payment_amount = payment['total_collected_money']['amount']
    creator_token_amount_hash[payment['creator_id']] += payment_amount
    creator_token_amount_hash["Total"] += payment_amount
  end

  creator_token_amount_hash
end

# Use nil for the full count.
def itemization_name_quantity_hash(creator_id = nil, begin_time = "2014-02-01", end_time = "2014-03-01")
  item_name_quantity_hash = Hash.new(0)

  payments = retrieve_payments(begin_time, end_time)

  payments.each do |payment|
    if creator_id.present? and creator_id != payment['creator_id']
      next
    end

    # TODO(vida): Is the creator token empty if it's the merchant account?
    itemizations = retrieve_itemizations(payment['id'])
    itemizations.each do |item|
      item_name_quantity_hash[item['name']] += item['quantity'].to_f
    end
  end

  item_name_quantity_hash
end

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

def retrieve_itemizations(payment_id)
  uri = URI.parse("https://connect.squareup.com/v1/me/payments/#{payment_id}")
  https = Net::HTTP.new(uri.host, uri.port)
  https.use_ssl = true
  res = https.request(Net::HTTP::Get.new(uri.path, @@HEADERS))

  JSON.parse(res.body)['itemizations']
end








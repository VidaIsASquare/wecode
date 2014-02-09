require "#{Rails.root}/lib/square_connect"

class ScoutsController < ApplicationController
  def index
    @creator_token_payment_amount_hash = creator_token_payment_amount_hash()
    puts @creator_token_payment_amount_hash
  end

  def cookie_counts
    @itemization_name_quantity_hash = itemization_name_quantity_hash(params[:creator_id])
  end
end

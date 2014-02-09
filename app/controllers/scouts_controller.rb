require "#{Rails.root}/lib/square_connect"

class ScoutsController < ApplicationController
  def index
  end

  def payment_totals
    @creator_token_payment_amount_hash = creator_token_payment_amount_hash()
    render :json => @creator_token_payment_amount_hash
  end

  def cookie_counts
    @itemization_name_quantity_hash = itemization_name_quantity_hash(params[:creator_id])
    render :json => @itemization_name_quantity_hash
  end
end

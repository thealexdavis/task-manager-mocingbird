module Api
  module V1
    class UsersController < ApplicationController

      # Retreiving the current user information, aka profile
      def profile
        render json: { user: @current_user.as_json(only: [:id, :first_name, :last_name, :email]) }
      end

    end
  end
end

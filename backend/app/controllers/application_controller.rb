class ApplicationController < ActionController::API
    include ActionController::Cookies
    
    before_action :authenticate_request
    
    private

    # Defining current user if the user has logged in, otherwise its is unauthorized and returns. Looks for current user by ID from cookies insantiated by login
    def authenticate_request
        unless session[:user_id]
        render json: { error: "Unauthorized" }, status: :unauthorized and return
        end

        @current_user = User.find_by(id: session[:user_id])
        render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
    end
end

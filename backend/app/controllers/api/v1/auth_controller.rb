module Api
    module V1
        class AuthController < ApplicationController
            skip_before_action :authenticate_request, only: [:signup, :login]

            # Authentication for sign up
            def signup
                user = User.new(user_params)

                if user.save
                session[:user_id] = user.id
                render json: { user: user_response(user) }, status: :created
                else
                render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
                end
            end

            # Authentication for login
            def login
                user = User.find_by(email: params[:email]&.downcase)

                if user&.authenticate(params[:password])
                session[:user_id] = user.id
                render json: { user: user_response(user) }
                else
                render json: { error: "Invalid email or password" }, status: :unauthorized
                end
            end

            # Authentication for log out
            def logout
                session.delete(:user_id) # Invalidate server-side immediately
                render json: { message: "Logged out successfully" }
            end

            private

            # Getting the user parameters
            def user_params
                params.permit(:first_name, :last_name, :email, :password, :password_confirmation)
            end

            # Getting user response
            def user_response(user)
                user.as_json(only: [:id, :first_name, :last_name, :email])
            end
        end
    end
end
Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # Setting the API directory routes
  namespace :api do
    # Setting the V1 API routes
    namespace :v1 do
      post   "auth/signup",  to: "auth#signup"
      post   "auth/login",   to: "auth#login"
      delete "auth/logout",  to: "auth#logout"
      get    "profile", to: "users#profile"
      resources :tasks, only: [:index, :create, :update, :destroy]
    end
  end
  
end

require "test_helper"

class Api::V1::RoutesTest < ActionDispatch::IntegrationTest

  
  # Testing the authorization routes
  test "POST /api/v1/auth/signup routes to auth#signup" do
    assert_routing({ method: :post, path: "/api/v1/auth/signup" },
                   { controller: "api/v1/auth", action: "signup" })
  end

  test "POST /api/v1/auth/login routes to auth#login" do
    assert_routing({ method: :post, path: "/api/v1/auth/login" },
                   { controller: "api/v1/auth", action: "login" })
  end

  test "DELETE /api/v1/auth/logout routes to auth#logout" do
    assert_routing({ method: :delete, path: "/api/v1/auth/logout" },
                   { controller: "api/v1/auth", action: "logout" })
  end

  # Testing if we can get profile successfully
  test "GET /api/v1/profile routes to users#profile" do
    assert_routing({ method: :get, path: "/api/v1/profile" },
                   { controller: "api/v1/users", action: "profile" })
  end

  # Testing the task routes
  test "GET /api/v1/tasks routes to tasks#index" do
    assert_routing({ method: :get, path: "/api/v1/tasks" },
                   { controller: "api/v1/tasks", action: "index" })
  end

  test "POST /api/v1/tasks routes to tasks#create" do
    assert_routing({ method: :post, path: "/api/v1/tasks" },
                   { controller: "api/v1/tasks", action: "create" })
  end

  test "PATCH /api/v1/tasks/:id routes to tasks#update" do
    assert_routing({ method: :patch, path: "/api/v1/tasks/1" },
                   { controller: "api/v1/tasks", action: "update", id: "1" })
  end

  test "DELETE /api/v1/tasks/:id routes to tasks#destroy" do
    assert_routing({ method: :delete, path: "/api/v1/tasks/1" },
                   { controller: "api/v1/tasks", action: "destroy", id: "1" })
  end

end

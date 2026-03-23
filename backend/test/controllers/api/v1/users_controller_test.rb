require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      password: "securepassword"
    )
    post "/api/v1/auth/login", params: { email: @user.email, password: "securepassword" }, as: :json
  end

  # Testing we can retrieve the current user's profile
  test "returns the current user's profile" do
    get "/api/v1/profile", as: :json

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal @user.id,         body["user"]["id"]
    assert_equal "Jane",           body["user"]["first_name"]
    assert_equal "Doe",            body["user"]["last_name"]
    assert_equal "jane@example.com", body["user"]["email"]
  end

  # Testing the profile does not expose sensitive fields
  test "does not expose password_digest or other sensitive fields" do
    get "/api/v1/profile", as: :json

    body = JSON.parse(response.body)
    assert_nil body["user"]["password_digest"]
    assert_nil body["user"]["password"]
    assert_nil body["user"]["created_at"]
    assert_nil body["user"]["updated_at"]
  end

  # Testing we cannot retrieve profile when not logged in
  test "returns unauthorized when not logged in" do
    delete "/api/v1/auth/logout", as: :json

    get "/api/v1/profile", as: :json

    assert_response :unauthorized
  end
end

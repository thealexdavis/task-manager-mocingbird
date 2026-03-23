require "test_helper"

class UserTest < ActiveSupport::TestCase
  def valid_user
    User.new(
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      password: "securepassword"
    )
  end

  # Validity
  test "is valid with all required fields" do
    assert valid_user.valid?
  end

  # Presence validations
  test "is invalid without a first name" do
    user = valid_user.tap { |u| u.first_name = nil }
    assert_not user.valid?
    assert_includes user.errors[:first_name], "can't be blank"
  end

  test "is invalid without a last name" do
    user = valid_user.tap { |u| u.last_name = nil }
    assert_not user.valid?
    assert_includes user.errors[:last_name], "can't be blank"
  end

  test "is invalid without an email" do
    user = valid_user.tap { |u| u.email = nil }
    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
  end

  # Email format
  test "is invalid with a badly formatted email" do
    user = valid_user.tap { |u| u.email = "not-an-email" }
    assert_not user.valid?
    assert user.errors[:email].any?
  end

  # Email uniqueness
  test "is invalid with a duplicate email" do
    valid_user.save!
    duplicate = valid_user.dup
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:email], "has already been taken"
  end

  test "email uniqueness is case-insensitive" do
    valid_user.save!
    duplicate = valid_user.dup.tap { |u| u.email = valid_user.email.upcase }
    assert_not duplicate.valid?
  end

  # Password length
  test "is invalid with a password shorter than 8 characters" do
    user = valid_user.tap { |u| u.password = "short" }
    assert_not user.valid?
    assert user.errors[:password].any?
  end

  test "is valid with a password of exactly 8 characters" do
    user = valid_user.tap { |u| u.password = "exactly8" }
    assert user.valid?
  end

  # Email downcasing
  test "lowercases email before saving" do
    user = valid_user.tap { |u| u.email = "Jane@Example.COM" }
    user.save!
    assert_equal "jane@example.com", user.reload.email
  end

  # has_secure_password
  test "authenticates with the correct password" do
    user = valid_user
    user.save!
    assert user.authenticate("securepassword")
  end

  test "does not authenticate with an incorrect password" do
    user = valid_user
    user.save!
    assert_not user.authenticate("wrongpassword")
  end

  # Association
  test "has many tasks" do
    assert_respond_to valid_user, :tasks
  end
end

require "test_helper"

class TaskTest < ActiveSupport::TestCase
  def valid_user
    User.create!(
      first_name: "Jane",
      last_name: "Doe",
      email: "jane#{SecureRandom.hex(4)}@example.com",
      password: "securepassword"
    )
  end

  def valid_task(user: valid_user)
    Task.new(title: "My Task", status: :pending, user: user)
  end

  # Testing if task is valid and has required fields
  test "is valid with all required fields" do
    assert valid_task.valid?
  end

  # Tests if task is missing title
  test "is invalid without a title" do
    task = valid_task.tap { |t| t.title = nil }
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  # Test if missing a status
  test "is invalid without a status" do
    task = valid_task.tap { |t| t.status = nil }
    assert_not task.valid?
    assert task.errors[:status].any?
  end

  # Making sure task has a user
  test "is invalid without a user" do
    task = Task.new(title: "Orphan Task", status: :pending)
    assert_not task.valid?
    assert task.errors[:user].any?
  end

  # Making sure the task belongs to a user
  test "belongs to a user" do
    user = valid_user
    task = valid_task(user: user)
    task.save!
    assert_equal user, task.user
  end

  # Verifying all of the statuses are valid
  test "accepts all valid status values" do
    user = valid_user
    %i[pending in_progress completed canceled blocked].each do |status|
      task = Task.new(title: "Task", status: status, user: user)
      assert task.valid?, "Expected status #{status} to be valid"
    end
  end

  # Checking for a status value not allowed
  test "raises an error for an unrecognized status value" do
    assert_raises(ArgumentError) do
      Task.new(title: "Task", status: :unknown, user: valid_user)
    end
  end

  # Testing if pending is true
  test "pending? returns true for a pending task" do
    assert valid_task.pending?
  end

  # Testing if complete is true
  test "completed? returns true after marking as completed" do
    task = valid_task
    task.status = :completed
    assert task.completed?
  end
end

require "test_helper"

class Api::V1::TasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      password: "securepassword"
    )
    post "/api/v1/auth/login", params: { email: @user.email, password: "securepassword" }, as: :json
  end

  # Testing we return a list of tasks for the current user
  test "returns the list of tasks for the current user" do
    @user.tasks.create!(title: "Task 1", status: :pending)
    @user.tasks.create!(title: "Task 2", status: :in_progress)

    get "/api/v1/tasks", as: :json

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal 2, body["tasks"].length
  end

  # Testing we do not return tasks that are not the user's
  test "does not return tasks belonging to other users" do
    other = User.create!(first_name: "John", last_name: "Smith", email: "john@example.com", password: "securepassword")
    other.tasks.create!(title: "Other Task", status: :pending)
    @user.tasks.create!(title: "My Task", status: :pending)

    get "/api/v1/tasks", as: :json

    body = JSON.parse(response.body)
    assert_equal 1, body["tasks"].length
    assert_equal "My Task", body["tasks"][0]["title"]
  end

  # Testing we can create a task
  test "creates a task with valid params" do
    post "/api/v1/tasks", params: { task: { title: "New Task", status: "pending" } }, as: :json

    assert_response :created
    body = JSON.parse(response.body)
    assert_equal "New Task", body["task"]["title"]
    assert_equal "pending", body["task"]["status"]
  end

  # Testing validation for title
  test "returns errors when creating a task without a title" do
    post "/api/v1/tasks", params: { task: { status: "pending" } }, as: :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body["errors"].any? { |e| e.include?("Title") }
  end

  # Testing validation for status
  test "returns errors when creating a task without a status" do
    post "/api/v1/tasks", params: { task: { title: "No Status Task" } }, as: :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body["errors"].any? { |e| e.include?("Status") }
  end

  # Testing ability to update a task
  test "updates a task with valid params" do
    task = @user.tasks.create!(title: "Original", status: :pending)

    patch "/api/v1/tasks/#{task.id}", params: { task: { title: "Updated", status: "completed" } }, as: :json

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal "Updated", body["task"]["title"]
    assert_equal "completed", body["task"]["status"]
  end

  # Testing cannot update task without title
  test "returns errors when updating a task with a blank title" do
    task = @user.tasks.create!(title: "Valid Task", status: :pending)

    patch "/api/v1/tasks/#{task.id}", params: { task: { title: "" } }, as: :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body["errors"].any?
  end

  # Testing we cannot update a task that isn't there
  test "returns not found when updating a task that does not exist" do
    patch "/api/v1/tasks/999999", params: { task: { title: "Ghost" } }, as: :json

    assert_response :not_found
  end

  # Testing we cannot update a different user's task
  test "cannot update another user's task" do
    other = User.create!(first_name: "John", last_name: "Smith", email: "john@example.com", password: "securepassword")
    other_task = other.tasks.create!(title: "Their Task", status: :pending)

    patch "/api/v1/tasks/#{other_task.id}", params: { task: { title: "Stolen" } }, as: :json

    assert_response :not_found
  end

  # Testing we can delete a task
  test "deletes a task" do
    task = @user.tasks.create!(title: "To Delete", status: :pending)

    delete "/api/v1/tasks/#{task.id}", as: :json

    assert_response :ok
    assert_equal "Task deleted", JSON.parse(response.body)["message"]
    assert_nil @user.tasks.find_by(id: task.id)
  end

  # Testing we cannot delete a nonexistent task
  test "returns not found when deleting a task that does not exist" do
    delete "/api/v1/tasks/999999", as: :json

    assert_response :not_found
  end

  # Testing we cannot delete another user's task
  test "cannot delete another user's task" do
    other = User.create!(first_name: "John", last_name: "Smith", email: "john@example.com", password: "securepassword")
    other_task = other.tasks.create!(title: "Their Task", status: :pending)

    delete "/api/v1/tasks/#{other_task.id}", as: :json

    assert_response :not_found
  end

  # Testing we will not allow API options when not logged in.
  test "returns unauthorized when not logged in" do
    delete "/api/v1/auth/logout", as: :json

    get "/api/v1/tasks", as: :json

    assert_response :unauthorized
  end
end

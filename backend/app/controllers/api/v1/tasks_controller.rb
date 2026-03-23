module Api
  module V1
    class TasksController < ApplicationController

      before_action :set_task, only: [:update, :destroy]

      # Default state of tasks and retreiving list for the user
      def index
        tasks = @current_user.tasks.order(created_at: :desc)
        render json: { tasks: tasks }, status: :ok
      end

      # Creating a new task with parameters
      def create
        task = @current_user.tasks.build(task_params)
        if task.save
          render json: { task: task }, status: :created
        else
          render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # Updating an existing task
      def update
        if @task.update(task_params)
          render json: { task: @task }, status: :ok
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # Deleting a task
      def destroy
        @task.destroy
        render json: { message: "Task deleted" }, status: :ok
      end

      private

      # Before Action ability to get the tasks by the current user
      def set_task
        @task = @current_user.tasks.find_by(id: params[:id])
        render json: { error: "Task not found" }, status: :not_found unless @task
      end

      # Task parameters definition and what is required
      def task_params
        params.require(:task).permit(:title, :description, :due_date, :status)
      end

    end
  end
end

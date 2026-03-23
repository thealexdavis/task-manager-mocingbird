class Task < ApplicationRecord
  
    # This helps set up a foreign key column in tasks table for user ID.
    belongs_to :user

    # Mapping integer values to the names of items
    enum :status, { pending: 0, in_progress: 1, completed: 2, canceled: 3, blocked: 4 }

    # Validations
    validates :title, presence: true
    validates :status, presence: true

end
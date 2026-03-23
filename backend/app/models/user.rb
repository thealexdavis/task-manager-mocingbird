class User < ApplicationRecord

    # One user can own many tasks
    has_many :tasks

    # Storing password as hashed secure password in password_digest.
    has_secure_password

    # Field validation metrics
    validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :first_name, :last_name, presence: true
    validates :password, length: { minimum: 8 }, if: -> { new_record? || password.present? }

    # Before saving it lowercases the email address
    before_save { self.email = email.downcase }

end

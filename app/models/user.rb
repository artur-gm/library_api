class User < ApplicationRecord
  # roles: member (default) and librarian
  enum :role, { member: 0, librarian: 1 }

  # Devise modules
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  include Devise::JWT::RevocationStrategies::JTIMatcher

  has_many :borrowings, dependent: :destroy

  validates :name, presence: true
end

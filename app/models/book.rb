# app/models/book.rb
class Book < ApplicationRecord
  has_many :borrowings, dependent: :destroy

  validates :title, :author, :isbn, :total_copies, presence: true
  validates :total_copies, numericality: { greater_than_or_equal_to: 0 }

  before_validation :ensure_available_copies, on: :create

  scope :search, ->(q) {
    where("title LIKE :q OR author LIKE :q OR genre LIKE :q", q: "%#{q}%") if q.present?
  }

  def ensure_available_copies
    self.available_copies = total_copies if available_copies.nil?
  end

  def available?
    available_copies.to_i > 0
  end
end

class Borrowing < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :user_id, :book_id, presence: true
  validate :book_is_available, on: :create
  validate :not_already_borrowed, on: :create

  before_create :set_borrowed_and_due
  after_create :decrement_book_available
  after_update :increment_book_if_returned, if: -> { saved_change_to_returned_at? && returned_at.present? }

  scope :overdue, -> { where("due_at < ? AND returned_at IS NULL", Time.current) }

  def returned?
    returned_at.present?
  end

  private

  def book_is_available
    errors.add(:book, "is not available") unless book&.available?
  end

  def not_already_borrowed
    if Borrowing.exists?(user_id: user_id, book_id: book_id, returned_at: nil)
      errors.add(:base, "You already have this book borrowed")
    end
  end

  def set_borrowed_and_due
    self.borrowed_at = Time.current
    self.due_at = 2.weeks.from_now
  end

  def decrement_book_available
    book.decrement!(:available_copies)
  end

  def increment_book_if_returned
    # ensure we increment only once per return
    if returned_at_previously_changed?
      book.increment!(:available_copies)
    end
  end
end

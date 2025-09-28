require 'rails_helper'

RSpec.describe Borrowing, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:book) }
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:book_id) }

  context 'when creating borrowing' do
    let(:book) { create(:book, total_copies: 1, available_copies: 1) }
    let(:user) { create(:user) }

    it 'decrements available copies' do
      borrowing = create(:borrowing, user: user, book: book)
      expect(book.reload.available_copies).to eq(book.total_copies - 1)
      expect(borrowing.due_at).to be_present
    end

    it 'prevents double borrow by same user' do
      create(:borrowing, user: user, book: book)
      second = build(:borrowing, user: user, book: book)
      expect(second).not_to be_valid
      expect(second.errors.full_messages.join).to include('You already have this book borrowed')
    end
  end
end

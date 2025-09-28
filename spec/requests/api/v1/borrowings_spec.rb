require 'rails_helper'

RSpec.describe "Borrowings API", type: :request do
  let(:member) { create(:user, :member) }
  let(:book)   { create(:book) }

  it "lets a member borrow a book" do
    post "/api/v1/borrowings",
         params: { borrowing: { book_id: book.id } },
         headers: auth_headers(member)
    expect(response).to have_http_status(:created)
    expect(JSON.parse(response.body)["book_id"]).to eq(book.id)
  end

  it "prevents borrowing when no copies available" do
    book.update!(available_copies: 0)
    post "/api/v1/borrowings",
         params: { borrowing: { book_id: book.id } },
         headers: auth_headers(member)
    expect(response).to have_http_status(:unprocessable_content)
  end
end

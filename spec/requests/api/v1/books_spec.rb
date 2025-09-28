require 'rails_helper'

RSpec.describe 'Books API', type: :request do
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user) }
  let!(:book) { create(:book) }

  describe 'GET /api/v1/books' do
    it 'returns list for authenticated member' do
      get '/api/v1/books', headers: auth_headers(member)
      expect(response).to have_http_status(:ok)
      parsed = JSON.parse(response.body)
      expect(parsed).to be_an(Array)
      expect(parsed.first).to include('title')
    end
  end

  describe 'POST /api/v1/books' do
    let(:params) do
      { book: { title: 'New Book', author: 'Author', genre: 'Fiction', isbn: 'ISBN-123', total_copies: 3 } }
    end

    it 'allows librarian to create' do
      post '/api/v1/books', params: params, headers: auth_headers(librarian)
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)['title']).to eq('New Book')
    end

    it 'allows librarian to update' do
      put "/api/v1/books/#{book.id}", params: { book: { title: 'Updated Title' } }, headers: auth_headers(librarian)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['title']).to eq('Updated Title')
    end

    it 'allows librarian to delete' do
      delete "/api/v1/books/#{book.id}", headers: auth_headers(librarian)
      expect(response).to have_http_status(:no_content)
    end

    it 'prevents member from creating' do
      post '/api/v1/books', params: params, headers: auth_headers(member)
      expect(response).to have_http_status(:forbidden)
    end
  end
end

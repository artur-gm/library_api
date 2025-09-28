require 'rails_helper'

RSpec.describe "Librarians API", type: :request do
  let(:librarian) { create(:user, :librarian) }
  let(:member)    { create(:user, :member) }

  it "allows librarian to create another librarian" do
    post "/admin/librarians",
         params: { user: { email: "lib2@example.com", password: "password", name: "New Lib" } },
         headers: auth_headers(librarian)
    expect(response).to have_http_status(:created)
  end

  it "forbids member from creating librarian" do
    post "/admin/librarians",
         params: { user: { email: "lib2@example.com", password: "password", name: "New Lib" } },
         headers: auth_headers(member)
    expect(response).to have_http_status(:forbidden)
  end
end

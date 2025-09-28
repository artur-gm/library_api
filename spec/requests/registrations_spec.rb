require 'rails_helper'

RSpec.describe "User Registrations", type: :request do
  describe "POST /users" do
    it "registers a member" do
      expect {
        post "/users", params: {
          user: {
            name: "John",
            email: "john@example.com",
            password: "secret123",
            password_confirmation: "secret123",
            role: "member"
          }
        }
      }.to change(User, :count).by(1)
      expect(response).to have_http_status(:success).or have_http_status(:created)
    end
  end
end

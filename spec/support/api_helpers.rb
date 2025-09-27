module ApiHelpers
  # Use Warden::JWTAuth::UserEncoder to create a token
  def auth_headers(user)
    token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
    { 'Authorization' => "Bearer #{token}" }
  end
end

RSpec.configure do |config|
  config.include ApiHelpers, type: :request
end

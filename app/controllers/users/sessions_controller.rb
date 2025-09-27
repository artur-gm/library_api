class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: "Signed in successfully",
      user: resource.as_json(only: %i[id email name role])
    }, status: :ok
  end

  def respond_to_on_destroy
    head :no_content
  end
end

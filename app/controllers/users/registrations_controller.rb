class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)

    resource.role = "member" # force role to member

    resource.save
    if resource.persisted?
      render json: { user: resource }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { message: "Signed up successfully", user: resource.as_json(only: %i[id email name role]) }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
    end
  end
end

class Admin::LibrariansController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource class: "User" # or class: 'Librarian' if you have a separate model

  def create
    @librarian = User.new(librarian_params.merge(role: "librarian"))

    if @librarian.save
      render json: @librarian, status: :created
    else
      render json: { errors: @librarian.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def librarian_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end

module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!  # Devise + JWT

      # GET /api/v1/current_user
      def current
        render json: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          role: current_user.role # member or librarian
        }
      end
    end
  end
end

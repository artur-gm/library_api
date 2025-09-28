module Api
  module V1
    class BorrowingsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_borrowing, only: %i[show return]
      load_and_authorize_resource only: %i[index create show]

      def index
        borrowings = if current_user.librarian?
          Borrowing.includes(:book, :user).all
        else
          current_user.borrowings.includes(:book)
        end

        render json: borrowings.as_json(
          include: {
            book: { only: [ :id, :title, :author, :genre, :isbn ] },
            user: { only: [ :id, :name, :email ] }
          }
        )
      end

      def create
        @borrowing = current_user.borrowings.build(borrowing_params)
        if @borrowing.save
          render json: @borrowing, status: :created
        else
          render json: { errors: @borrowing.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        render json: @borrowing
      end

      def return
        authorize! :return, @borrowing
        if @borrowing.returned?
          render json: { message: "Already returned" }, status: :unprocessable_entity
        else
          @borrowing.update(returned_at: Time.current)
          render json: @borrowing
        end
      end

      private

      def set_borrowing
        @borrowing = Borrowing.find(params[:id])
      end

      def borrowing_params
        params.require(:borrowing).permit(:book_id)
      end
    end
  end
end

module Api
  module V1
    class DashboardsController < ApplicationController
      before_action :authenticate_user!

      def show
        if current_user.librarian?
          total_books = Book.sum(:total_copies)
          total_borrowed = Borrowing.where(returned_at: nil).count
          due_today = Borrowing.where("DATE(due_at) = ? AND returned_at IS NULL", Date.current).count
          overdue_members = User.joins(:borrowings).merge(Borrowing.overdue).distinct.select(:id, :name, :email)

          render json: {
            total_books: total_books,
            total_borrowed: total_borrowed,
            due_today: due_today,
            overdue_members: overdue_members.as_json(only: %i[id name email])
          }
        else
          bor = current_user.borrowings
          render json: {
            borrowed: bor.as_json(include: { book: { only: %i[id title author] } }, methods: %i[borrowed_at due_at returned_at]),
            overdue: bor.overdue.as_json
          }
        end
      end
    end
  end
end
